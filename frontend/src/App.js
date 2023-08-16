import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';


import Button from '@mui/material/Button';
import SignInSide from './SignInSide'

import { ApiAuthProvider } from './ApiAuthContext';
import Main from './Main';
import Dashboard from './Dashboard';
import ManageTweets from './ManageTweets';
import PrivateRoute  from './PrivateRoute';


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
