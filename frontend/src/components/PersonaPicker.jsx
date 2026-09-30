import { PERSONAS } from "../personas";

export default function PersonaPicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Tipe ekspektasi klien" className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {PERSONAS.map((p) => {
        const on = value === p.id;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(p.id)}
            className={`text-left p-3 rounded-xl border-2 min-h-[92px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              on ? "border-primary bg-tint" : "border-line bg-white hover:border-primary/50"
            }`}
          >
            <span className="msr text-primary">{p.icon}</span>
            <span className="block mt-1 text-[13px] font-semibold leading-snug">{p.name}</span>
            <span className="block text-xs text-muted">{p.trait}</span>
          </button>
        );
      })}
    </div>
  );
}
