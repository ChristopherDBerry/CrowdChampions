import React, { createContext, useContext, useState } from 'react';
import { ApiAuthProvider } from './ApiAuthContext';
import Button from '@mui/material/Button';
import SignInSide from './SignInSide'


export default function App() {
  return (
    <ApiAuthProvider>
      <div>
        <SignInSide />
        <Button variant="contained">Hello world</Button>
      </div>
    </ApiAuthProvider>
  );
}
