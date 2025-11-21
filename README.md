# AI-Chatbot-for-stress-management

PeaceTalk is an empathetic AI-powered chatbot designed to reduce stress, provide emotional relief,  
and support users in difficult moments. The backend uses FastAPI and Hugging Face LLM models,  
and the frontend is a lightweight HTML/JS interface for real-time chatting.

## Tech Stack

| Component | Technology |
|----------|------------|
| Backend | FastAPI, Python |
| LLM | Hugging Face Inference API |
| Frontend | HTML + CSS + JavaScript |
| Deployment | Uvicorn / Any cloud (Render, AWS, Azure, etc.) |


##  Project Structure

├── app.py # FastAPI backend
├── requirements.txt
├── .env # Contains HF_TOKEN & HF_MODEL
├── frontend/
│ ├── index.html
│ ├── styles.css
│ └── script.js
└── README.md

##  Start Server

uvicorn app:app --reload


 ## Features

 Memory-based session conversations
 Emotion-aware supportive replies
 Crisis-keyword detector
 Hugging Face LLM integration
 Works fully locally (no database required)


##  Contributing

Pull requests are welcome. For major changes, please open an issue first.


 ## License

This project is for educational and research purposes only and must not replace mental-health professionals.



## Built with care to help people feel heard. ##
