import os
from fastapi import FastAPI, types
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client()

app = FastAPI()

# Konfigurasi CORS agar frontend React bisa mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class EvaluationRequest(BaseModel):
    candidate_answer: str
    client_persona: str

@app.post("/api/evaluate")
async def evaluate_candidate(data: EvaluationRequest):
    # Prompt Engineering
    prompt = f"""
    Anda adalah Pakar Rekrutmen AI. Analisis jawaban kandidat berikut.
    Tipe Ekspektasi Klien: {data.client_persona}
    Jawaban Kandidat: "{data.candidate_answer}"
    
    Berikan JSON dengan struktur:
    - score: (0-100)
    - analysis: (penjelasan singkat mengapa skor tersebut diberikan)
    - improvement_tips: (3 poin konkret agar kandidat tampil lebih baik sesuai gaya klien)
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=prompt,
            config={
                'response_mime_type': 'application/json' 
            }
        )
        # Langsung kembalikan teksnya
        return response.text
    except Exception as e:
        print(f"Error AI: {e}")
        return {"error": str(e)}