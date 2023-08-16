import React, { useContext, useEffect } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useApiAuthContext  } from './ApiAuthContext';

export default function PrivateRoute({ component: Component, ...rest }) {

  const history = useHistory();

  const { apiAuth, setApiAuth } = useApiAuthContext();
  const { username, token } = apiAuth;

  useEffect(() => {
    if (!username || !token) {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        if (username && token) console.log('Set token from local storage: ', username, token);
        if (username && token) setApiAuth({ username, token });
        else history.push('/login');
    }
  }, []);

  return <Route {...rest} component={Component} />;

}