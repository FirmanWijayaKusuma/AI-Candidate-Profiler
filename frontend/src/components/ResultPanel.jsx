import { ASPECTS } from "../personas";

const STEPS = ["Membaca jawaban", "Menilai", "Menyusun tips"];
const tone = (s) => (s >= 75 ? "#00695C" : s >= 50 ? "#B45309" : "#BA1A1A");

function Ring({ score }) {
  const C = 2 * Math.PI * 52;
  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="52" fill="none" stroke="#D9E2E0" strokeWidth="10" />
        <circle cx="60" cy="60" r="52" fill="none" stroke={tone(score)} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold">{score}</span>
        <span className="text-xs text-muted">/100</span>
      </div>
    </div>
  );
}

export default function ResultPanel({ status, result, error, step, personaName, onRetry }) {
  if (status === "idle")
    return (
      <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center text-muted gap-2">
        <span className="msr text-primary" style={{ fontSize: 40 }}>insights</span>
        <p className="font-semibold text-ink">Belum ada hasil</p>
        <p className="text-sm max-w-xs">Pilih tipe klien, tempel jawaban kandidat, lalu klik Analisis Jawaban.</p>
      </div>
    );

  if (status === "loading")
    return (
      <div className="min-h-[320px] space-y-4" aria-live="polite">
        <div className="h-24 rounded-xl bg-line/60 animate-pulse" />
        <div className="h-16 rounded-xl bg-line/60 animate-pulse" />
        <ol className="flex gap-4 text-sm">
          {STEPS.map((s, i) => (
            <li key={s} className={i <= step ? "text-primary font-semibold" : "text-muted"}>{s}</li>
          ))}
        </ol>
      </div>
    );

  if (status === "error")
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-red-50 border border-danger/20">
        <p className="text-sm text-danger">{error}</p>
        <button onClick={onRetry} className="px-3 py-1.5 rounded-lg border border-danger/30 text-danger text-sm font-semibold whitespace-nowrap">
          Coba lagi
        </button>
      </div>
    );

  const text = () =>
    `Klien: ${personaName}\nSkor: ${result.score}/100\n\n${result.analysis}\n\nTips:\n` +
    result.tips.map((t, i) => `${i + 1}. ${t}`).join("\n");
  const copy = () => navigator.clipboard.writeText(text());
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text()], { type: "text/plain" }));
    a.download = "hasil-analisis.txt";
    a.click();
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted">Diselaraskan dengan persona: <b className="text-primary">{personaName}</b></p>
      <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-surface border border-line">
        <Ring score={result.score} />
        <div className="flex-1 min-w-[200px] space-y-2.5">
          {ASPECTS.map(([k, label]) => (
            <div key={k}>
              <div className="flex justify-between text-xs font-medium"><span>{label}</span><span>{result.aspects[k]}%</span></div>
              <div className="h-1.5 rounded bg-line"><div className="h-full rounded" style={{ width: `${result.aspects[k]}%`, background: tone(result.aspects[k]) }} /></div>
            </div>
          ))}
        </div>
      </div>
      <p className="p-4 rounded-xl bg-tint text-sm leading-relaxed">{result.analysis}</p>
      <div>
        <h3 className="font-bold mb-2">Tips briefing sebelum bertemu klien</h3>
        <ol className="space-y-2">
          {result.tips.map((t, i) => (
            <li key={i} className="flex gap-3 p-3 rounded-xl border border-line bg-white text-sm">
              <span className="w-6 h-6 shrink-0 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>{t}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex gap-2">
        <button onClick={copy} className="px-3 py-2 rounded-lg border border-line text-sm font-semibold whitespace-nowrap">Salin hasil</button>
        <button onClick={download} className="px-3 py-2 rounded-lg bg-tint text-primary text-sm font-semibold whitespace-nowrap">Ekspor</button>
      </div>
    </div>
  );
}
