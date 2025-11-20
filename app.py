import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from huggingface_hub import InferenceClient 

# Load env
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv("HF_MODEL")
 
print("HF_TOKEN exists?", HF_TOKEN is not None)
print("HF_MODEL =", HF_MODEL)

if not HF_TOKEN:
    raise RuntimeError("HF_TOKEN missing")
if not HF_MODEL:
    raise RuntimeError("HF_MODEL missing")

# HF Client
client = InferenceClient(model=HF_MODEL, token=HF_TOKEN)

# FastAPI App
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

SESSIONS = {}

SYSTEM_PROMPT = (
    "You are Peace Talk, a calm and empathetic stress-management assistant. "
    "Keep replies short, supportive, and caring."
)

CRISIS_KEYWORDS = [
    "suicide", "kill myself", "i want to die", "end my life",
    "hurt myself", "i can't go on"
]


def contains_crisis(text: str) -> bool:
    t = text.lower()
    return any(kw in t for kw in CRISIS_KEYWORDS)


def build_messages(history, user_msg):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for h in history[-10:]:
        messages.append({"role": h["role"], "content": h["text"]})

    messages.append({"role": "user", "content": user_msg})
    return messages


def hf_generate(messages):
    try:
        response = client.chat_completion(
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message["content"]
    except Exception as e:
        print("HF API Error:", e)
        return "Sorry — I’m having trouble generating a response right now."


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    session = request.session_id
    user_msg = request.message.strip()

    if session not in SESSIONS:
        SESSIONS[session] = []

    if contains_crisis(user_msg):
        return {
            "response":
                "I'm really sorry you're feeling this way. If you're in danger, "
                "please reach out to emergency services or a crisis hotline immediately."
        }

    SESSIONS[session].append({"role": "user", "text": user_msg})

    messages = build_messages(SESSIONS[session], user_msg)
    reply = hf_generate(messages)

    SESSIONS[session].append({"role": "assistant", "text": reply})

    return {"response": reply}


@app.get("/health")
def health():
    return {"status": "ok", "model": HF_MODEL}

@app.get("/")
def root():
    return {"message": "API running"}
