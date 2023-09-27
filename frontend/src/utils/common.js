import axios from 'axios';

export function processData(
  url, token, callback,
  method = 'get', params = {}) {

  if (!token) return

  const config = {
    headers: {
      Authorization: `Token ${token}`
    }
  }
  axios({
    method,
    url,
    data: params,
    ...config,
    }).then(response => {
      callback(response.data);
    })
    .catch(error => {
      if (callbackError) callbackError(error);
      else console.error('Error fetching data:', error);
    })
}
