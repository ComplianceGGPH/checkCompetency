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
      <h1 className='main' >Guide Competency Level</h1>
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
            <table className="result-table">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{result.name}</td>
                </tr>
                <tr>
                  <th>NickName</th>
                  <td>{result.nickname}</td>
                </tr>
                <tr>
                  <th>Registration No</th>
                  <td>{result.RegNo}</td>
                </tr>
              </tbody>
            </table>

            <h3><strong>Activity Competency Level: {result.level}</strong></h3>
            <table className="result-activity">
              <tbody>
                <tr>
                  <th>White Water Rafting</th>
                  <td>{result.WWR}</td>
                </tr>
                <tr>
                  <th>Fun Trip Rafting</th>
                  <td>{result.FTR}</td>
                </tr>
                <tr>
                  <th>Waterfall Abseiling</th>
                  <td>{result.WA}</td>
                </tr>
                <tr>
                  <th>ATV</th>
                  <td>{result.ATV}</td>
                </tr>
                <tr>
                  <th>Paintball</th>
                  <td>{result.PB}</td>
                </tr>
                <tr>
                  <th>Sunset Hiking / Jungle Trekking / Cave Exploration</th>
                  <td>{result.SHJTCE}</td>
                </tr>
                <tr>
                  <th>Telematch / Team Building</th>
                  <td>{result.TMTB}</td>
                </tr>
              </tbody>
            </table>
            <p className="note">
              <strong>To update your competency level, please submit your latest certificates through the admin.</strong>
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default App
