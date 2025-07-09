import { useState } from 'react'
import Logo from './assets/LOGOGGPBIG.png'
import './App.css'

function App() {

  const API_BASE = '/api'; // now works on same domain

  const [icNumber, setIcNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    console.log('Button clicked, icNumber =', icNumber);
    setResult(null);         // clear previous result
    setLoading(true);        // start loading

    try {
      const response = await fetch(`${API_BASE}/check-ic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ icNumber }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API response:', data);
      setResult(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setResult({ message: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);     // end loading
    }
  };

  return (
    <>
      <div>
        <a>
          <img src={Logo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Guide Competency Level</h1>
      <div className="card">
        <input
          type='text'
          placeholder='IC NUMBER'
          value={icNumber}
          onChange={(e) => setIcNumber(e.target.value)} />
        <button onClick={fetchData}>
          Submit
        </button>

        {loading && <p className="loading">Loading...</p>}

        {result && result.message ? (
          <div className="error">
            <p>{result.message}</p>
          </div>
        ) : result && (
          <div className="result">
            <h3>Result</h3>
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>NickName:</strong> {result.nickname}</p>
            <p><strong>IC:</strong> {result.icNumber}</p><br></br>

            <h2><strong>Activity Competency Level:</strong> {result.level}</h2>

            <p><strong>White Water Rafting:</strong> {result.WWR}</p>
            <p><strong>Fun Trip Rafting:</strong> {result.FTR}</p>
            <p><strong>Waterfall Abseiling:</strong> {result.WA}</p>
            <p><strong>ATV:</strong> {result.ATV}</p>
            <p><strong>Paintball:</strong> {result.PB}</p>
            <p><strong>Sunset Hiking / Jungle Trekking / Cave Exploration:</strong> {result.SHJTCE}</p>
            <p><strong>Telematch / Team Building:</strong> {result.TMTB}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default App
