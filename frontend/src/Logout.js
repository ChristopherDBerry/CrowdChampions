import React from 'react';
import { useHistory } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import IconLogout from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { useApiAuthContext  } from './ApiAuthContext';

export default function Logout() {
  const { apiAuth, setApiAuth } = useApiAuthContext();
  const history = useHistory();

  function handleLogout() {
    setApiAuth({ username: '', token: '' });
    localStorage.setItem('username', '');
    localStorage.setItem('token', '');
    history.push('/login');
  }

  return (
    <IconButton onClick={handleLogout} color="inherit">
      <IconLogout color="inherit">
      </IconLogout>
  </IconButton>
  );
}
