import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const token = ''; // Replace with the actual token

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Token ${token}`
      }
    };

    axios.get('http://localhost:8000/api/twitter/clients/', config)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.username}</div>
      ))}
    </div>
  );
}

export default App;
