import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const API_BASE_URL = 'https://short-url-project-km0q.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/shorten`, { originalUrl: longUrl });
      setResult(res.data);
      fetchHistory();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการสร้างลิงก์');
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Short URL Generator</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input 
          type="url" 
          placeholder="วางลิงก์ยาวที่นี่..." 
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required 
          style={{ width: '70%', padding: '12px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', marginLeft: '10px' }}>
          สร้าง Short URL
        </button>
      </form>

      {result && (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
          <h3>สร้างสำเร็จ!</h3>
          <p>ลิงก์ของคุณ: <a href={`${API_BASE_URL}/${result.shortCode}`} target="_blank" rel="noreferrer">
            {`${API_BASE_URL}/${result.shortCode}`}
          </a></p>
          <img src={result.qrCode} alt="QR Code" style={{ marginTop: '10px' }} />
        </div>
      )}

      <h2>ประวัติการใช้งาน</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#eee' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Original URL</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Short URL</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>จำนวนคลิก</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item._id}>
              <td style={{ padding: '10px', border: '1px solid #ddd', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.originalUrl}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <a href={`${API_BASE_URL}/${item.shortCode}`} target="_blank" rel="noreferrer">{item.shortCode}</a>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{item.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;