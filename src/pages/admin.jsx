import { useState } from 'react'
import Logo from '../assets/LOGOGGPBIG.png'
// import '../css/Home.css'
// import '../css/Admin.css'
import '../index.css'

function Admin() {

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
        <a className="flex items-center justify-center">
          <img src={Logo} className="logo" alt="React" />
        </a>
      </div>
      <h1 className='main mb-3'>GGP GUIDE ADMIN</h1>
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
          <p>{result.message}</p>
        ) : result ? (
          <div className="table-wrapper flex flex-col items-center justify-center bg-blue-950 p-4 rounded-lg shadow-md">
            <div className="flex justify-center items-center bg-blue-900 p-4 rounded-lg w-15/16 text-white space-x-3">
              <p>{result.name}</p>
              -
              <p className="ml-3">{result.RegNo}</p>
            </div>

            {[
              { key: 'WWRFTR', label: 'WWR / FTR' },
              { key: 'WA', label: 'WA' },
              { key: 'ATV', label: 'ATV' },
              { key: 'PB', label: 'PB' },
              { key: 'SHJTCE', label: 'SH / JT / CE' },
              { key: 'TMTB', label: 'TM / TB' },
              { key: 'DRIVER', label: 'Driver' }
            ].map((activity, index) => {
              const tier = result[activity.key];
              const isTier1 = tier === 'TIER 1';
              const isNill = tier === 'NILL';

              const cardLink = result[`${activity.key}CARD`];
              const certLink = result[`${activity.key}CERT`];

              return (
                <div
                  key={index}
                  className="mt-4 flex flex-row justify-center items-center bg-blue-800 p-4 rounded-lg w-15/16 text-white text-center space-x-4"
                >
                  <button
                    onClick={() => window.open(cardLink, '_blank')}
                    disabled={isNill || !cardLink}
                    className={`px-3 py-1 rounded-md text-white ${isNill || !cardLink
                      ? 'bg-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                  >
                    CARD
                  </button>

                  <p className="inline-block border-l border-r border-r-indigo-50 w-35 py-1">
                    {activity.label}
                  </p>

                  <button
                    onClick={() => window.open(certLink, '_blank')}
                    disabled={isTier1 || isNill || !certLink}
                    className={`px-3 py-1 rounded-md text-white ${isTier1 || isNill || !certLink
                      ? 'bg-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                  >
                    CERT
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Admin;