import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch JSON resource
    axios.get('http://localhost:8000/api/twitter/clients/')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>JSON Resource Example:</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
