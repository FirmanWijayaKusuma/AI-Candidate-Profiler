import React, { useState } from 'react';

function App() {
  const [answer, setAnswer] = useState('');
  const [persona, setPersona] = useState('Corporate Consultant');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async () => {
    setLoading(true);
    setResult(null); // Reset hasil sebelumnya setiap kali tombol diklik
    
    try {
      const response = await fetch('3.106.132.144', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_answer: answer, client_persona: persona }),
      });

      if (!response.ok) {
        throw new Error(`Gagal terhubung ke backend (Status HTTP: ${response.status})`);
      }

      const rawData = await response.json();
      
      // Kadang data datang sebagai string, kadang sebagai objek langsung
      const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      
      setResult(parsedData);
      
    } catch (error) {
      console.error("Detail Error:", error);
      // Alih-alih pakai alert yang mengganggu, kita set error ke state agar tampil rapi di UI
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>AI Candidate Profiler</h2>
      
      <label style={{ fontWeight: 'bold' }}>Pilih Tipe Ekspektasi Klien:</label>
      <select 
        value={persona} 
        onChange={(e) => setPersona(e.target.value)} 
        style={{ width: '100%', padding: '8px', marginBottom: '15px', marginTop: '5px', borderRadius: '4px' }}
      >
        <option value="Corporate Consultant">Corporate Consultant (Formal & Structured)</option>
        <option value="Agile Startup">Agile Startup (Fast-paced & Scrappy)</option>
      </select>

      <label style={{ fontWeight: 'bold' }}>Transkrip Jawaban Kandidat:</label>
      <textarea 
        placeholder="Ketik atau paste transkrip jawaban kandidat di sini..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows="6"
        style={{ width: '100%', padding: '8px', marginBottom: '15px', marginTop: '5px', borderRadius: '4px' }}
      />

      <button 
        onClick={handleEvaluate} 
        disabled={loading || answer.trim() === ''}
        style={{ 
          padding: '10px 15px', 
          backgroundColor: loading || answer.trim() === '' ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: loading || answer.trim() === '' ? 'not-allowed' : 'pointer',
          width: '100%',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'AI Sedang Menganalisis...' : 'Analisis Jawaban'}
      </button>

      {/* Tampilan UI Jika AI Mengembalikan Error (Misal: Limit Kuota) */}
      {result && result.error && (
        <div style={{ marginTop: '20px', border: '1px solid #f5c6cb', padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>
          <h3 style={{ marginTop: 0 }}>Gagal Menganalisis</h3>
          <p><strong>Pesan Sistem:</strong> {result.error}</p>
          <p style={{ fontSize: '0.9em' }}>*Pastikan API Key valid, limit belum habis, dan backend berjalan.</p>
        </div>
      )}

      {/* Tampilan UI Jika Analisis Berhasil */}
      {result && !result.error && result.score !== undefined && (
        <div style={{ marginTop: '20px', border: '1px solid #c3e6cb', padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #c3e6cb', paddingBottom: '10px' }}>
            Skor Kecocokan: {result.score}/100
          </h3>
          <p><strong>Analisis:</strong> <br/> {result.analysis}</p>
          
          <p style={{ marginTop: '15px' }}><strong>Tips Briefing Sebelum Bertemu Klien:</strong></p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {/* Optional Chaining (?.) mencegah crash jika AI lupa memberikan list tips */}
            {result.improvement_tips?.map((tip, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;