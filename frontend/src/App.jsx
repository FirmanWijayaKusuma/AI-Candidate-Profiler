import { useEffect, useState } from "react";
import PersonaPicker from "./components/PersonaPicker";
import ResultPanel from "./components/ResultPanel";
import { PERSONAS, SAMPLE } from "./personas";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const GITHUB_URL = "https://github.com/FirmanWijayaKusuma/AI-Candidate-Profiler"; // cek ulang link repo
const PORTFOLIO_URL = "https://firmanwijayaportfolio.lovable.app";
const KEY = "acp-history";
const MAX = 1500;

const ago = (t) => {
  const m = Math.round((Date.now() - t) / 60000);
  return m < 1 ? "Baru saja" : m < 60 ? `${m} menit lalu` : m < 1440 ? `${Math.round(m / 60)} jam lalu` : `${Math.round(m / 1440)} hari lalu`;
};

export default function App() {
  const [persona, setPersona] = useState("korporat");
  const [custom, setCustom] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);

  const personaName = PERSONAS.find((p) => p.id === persona).name;
  const ready = answer.trim().length >= 20 && (persona !== "custom" || custom.trim().length >= 5);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(KEY)) || []); } catch { /* abaikan */ }
  }, []);

  useEffect(() => {
    if (status !== "loading") return;
    setStep(0);
    const t = setInterval(() => setStep((s) => Math.min(s + 1, 2)), 1500);
    return () => clearInterval(t);
  }, [status]);

  const saveHistory = (next) => {
    setHistory(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* abaikan */ }
  };

  const analyze = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_answer: answer,
          persona,
          custom_description: persona === "custom" ? custom : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Isian belum valid. Jawaban minimal 20 karakter.");
      setResult(data);
      setStatus("success");
      saveHistory([{ persona: personaName, score: data.score, at: Date.now() }, ...history].slice(0, 4));
    } catch (e) {
      setError(e.message === "Failed to fetch" ? "Gagal menghubungi server. Cek koneksi Anda lalu coba lagi." : e.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-line">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-extrabold text-primary">AI Candidate Profiler</span>
          <div className="flex items-center gap-5 text-sm font-medium">
            <a href="#cara-kerja" className="hidden sm:inline hover:text-primary">Cara Kerja</a>
            <a href="#tech" className="hidden sm:inline hover:text-primary">Tech Stack</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
            <a href="#tool" className="px-4 py-2 rounded-lg bg-primary text-white whitespace-nowrap">Coba Sekarang</a>
          </div>
        </nav>
      </header>

      <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Uji jawaban kandidat sesuai gaya klien</h1>
        <p className="mt-4 text-muted">Jawaban yang sama bisa dinilai berbeda oleh klien yang berbeda. Tempel jawaban, pilih klien, dan lihat skor beserta tips perbaikannya.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-muted">
          <span>9 persona klien</span><span>Ditenagai Gemini API</span><span>Bahasa Indonesia</span>
        </div>
      </section>

      <main id="tool" className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-6">
        <section className="p-5 rounded-2xl bg-white border border-line shadow-sm space-y-4">
          <h2 className="font-bold">1. Pilih tipe ekspektasi klien</h2>
          <PersonaPicker value={persona} onChange={setPersona} />
          {persona === "custom" && (
            <input value={custom} onChange={(e) => setCustom(e.target.value)} maxLength={300}
              placeholder="Contoh: klien manufaktur yang mengutamakan keselamatan kerja"
              className="w-full p-3 rounded-xl border border-line text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          )}
          <div className="flex items-center justify-between">
            <h2 className="font-bold">2. Transkrip jawaban kandidat</h2>
            <button type="button" onClick={() => setAnswer(SAMPLE)} className="text-sm text-primary font-semibold">Coba contoh jawaban</button>
          </div>
          <div>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value.slice(0, MAX))} rows={8}
              placeholder="Tempel jawaban kandidat di sini (minimal 20 karakter)"
              className="w-full p-3 rounded-xl border border-line text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <p className="mt-1 text-right text-xs text-muted">{answer.length} / {MAX} karakter</p>
          </div>
          <button onClick={analyze} disabled={!ready || status === "loading"}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold disabled:opacity-40">
            {status === "loading" ? "Menganalisis..." : "Analisis Jawaban"}
          </button>
        </section>

        <section className="p-5 rounded-2xl bg-white border border-line shadow-sm">
          <ResultPanel status={status} result={result} error={error} step={step} personaName={personaName} onRetry={analyze} />
        </section>
      </main>

      {history.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Riwayat Analisis</h2>
            <button onClick={() => saveHistory([])} className="text-sm text-muted hover:text-danger">Hapus riwayat</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {history.map((h, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-line">
                <p className="text-xs text-muted">{ago(h.at)}</p>
                <p className="font-semibold text-sm mt-1">{h.persona}</p>
                <p className="mt-2 text-sm">Skor <b className="text-primary">{h.score}/100</b></p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="cara-kerja" className="max-w-6xl mx-auto px-4 mt-16">
        <h2 className="font-bold text-lg mb-3">Cara Kerja</h2>
        <ol className="grid sm:grid-cols-3 gap-3">
          {[["Pilih klien", "Tentukan gaya klien, dari korporat formal sampai agensi kreatif, atau tulis sendiri."],
            ["Tempel jawaban", "Masukkan transkrip jawaban wawancara, maksimal 1500 karakter."],
            ["Terima skor dan tips", "Lihat skor, lima aspek penilaian, dan tiga tips briefing."]].map(([t, d], i) => (
            <li key={t} className="p-4 rounded-xl bg-white border border-line">
              <p className="font-semibold">{i + 1}. {t}</p><p className="text-sm text-muted mt-1">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="tech" className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="font-bold text-lg mb-3">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {["React", "FastAPI", "Gemini API", "Docker", "AWS EC2"].map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-full bg-tint text-primary text-sm font-semibold">{t}</span>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-line bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap justify-between gap-3 text-sm text-muted">
          <p>Hasil hanya alat bantu, bukan keputusan rekrutmen. Transkrip diproses melalui Gemini API.</p>
          <div className="flex gap-4">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
            <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="hover:text-primary">Portofolio</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
