import React, { createContext, useContext, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'


import Button from '@mui/material/Button'
import SignInSide from './components/SignInSide'

import { ApiAuthProvider } from './components/ApiAuthContext'
import Dashboard from './components/Dashboard'
import Clients from './components/Clients'
import Tweets from './components/Tweets'
import PrivateRoute  from './components/PrivateRoute'


export default function App() {

  return (
    <ApiAuthProvider>
      <Router>
        <Switch>
          <Route exact path={['/', '/login']} component={SignInSide} />
          <PrivateRoute exact path="/dashboard">
            <Dashboard>
              <Clients />
            </Dashboard>
          </PrivateRoute>
          <PrivateRoute path="/dashboard/manage-tweets/:clientId">
            <Dashboard>
              <Tweets />
            </Dashboard>
          </PrivateRoute>
        </Switch>
      </Router>
    </ApiAuthProvider>
  );
}
