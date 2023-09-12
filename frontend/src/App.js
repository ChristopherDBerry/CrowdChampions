import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';


import Button from '@mui/material/Button';
import SignInSide from './components/SignInSide'

import { ApiAuthProvider } from './components/ApiAuthContext';
import Dashboard from './components/Dashboard';
import ManageTweets from './components/ManageTweets';
import PrivateRoute  from './components/PrivateRoute';


export default function App() {

  return (
    <ApiAuthProvider>
      <Router>
        <Switch>
          <Route exact path={['/', '/login']} component={SignInSide} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/manage-tweets/:id" component={ManageTweets} />
        </Switch>
      </Router>
    </ApiAuthProvider>
  );
}
