export const PERSONAS = [
  { id: "korporat", name: "Korporat & Konsultan", trait: "formal, terstruktur", icon: "domain" },
  { id: "startup", name: "Startup Agile", trait: "cepat, gesit", icon: "rocket_launch" },
  { id: "pemerintahan", name: "Pemerintahan & BUMN", trait: "prosedural, patuh aturan", icon: "account_balance" },
  { id: "ngo", name: "NGO & Sosial", trait: "misi dan dampak", icon: "volunteer_activism" },
  { id: "akademik", name: "Akademik & Riset", trait: "metodis, berbasis bukti", icon: "school" },
  { id: "kreatif", name: "Kreatif & Agensi", trait: "ekspresif, storytelling", icon: "palette" },
  { id: "teknikal", name: "Teknikal & Engineering", trait: "presisi, detail teknis", icon: "terminal" },
  { id: "layanan", name: "Layanan Pelanggan & Retail", trait: "ramah, responsif", icon: "support_agent" },
  { id: "custom", name: "Custom", trait: "tulis sendiri", icon: "tune" },
];

export const ASPECTS = [
  ["clarity", "Kejelasan"],
  ["structure", "Struktur"],
  ["relevance", "Relevansi"],
  ["style_fit", "Kesesuaian Gaya"],
  ["confidence", "Kepercayaan Diri"],
];

export const SAMPLE =
  "Ketika mendapat alert bahwa server utama down dan website tidak bisa diakses, saya tidak menunggu persetujuan tertulis dari atasan atau membuat tiket insiden terlebih dahulu karena itu akan memakan waktu terlalu lama. Saya langsung melakukan akses SSH ke root server, melakukan hard restart, dan secara sepihak menambahkan kapasitas RAM sementara agar sistem bisa online kembali dalam waktu kurang dari 5 menit. Setelah trafik kembali stabil, baru saya menulis laporan kejadiannya kepada manajer dan mencari akar masalahnya.";
