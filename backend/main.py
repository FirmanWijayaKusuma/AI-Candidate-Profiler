import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# 1. KONFIGURASI API KEY (Sintaks Standar)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# 2. INISIALISASI MODEL
model = genai.GenerativeModel('gemini-1.5-flash')

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
        # 3. GENERASI KONTEN (Sintaks Standar)
        response = model.generate_content(
            prompt,
            generation_config={
                "response_mime_type": "application/json"
            }
        )
        # Langsung kembalikan teks JSON-nya
        return response.text
    except Exception as e:
        print(f"Error AI: {e}")
        return {"error": str(e)}