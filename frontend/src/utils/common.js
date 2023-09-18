import axios from 'axios';

export function processData(url, token, callback) {

  const config = {
    headers: {
      Authorization: `Token ${token}`
    }
  }
  axios.get(url, config)
    .then(response => {
      callback(response.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    })
}