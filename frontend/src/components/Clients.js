import axios from 'axios';

import * as React from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import Title from './Title';
import { useApiAuthContext  } from './ApiAuthContext';
import { GET_USER_CLIENTS_URL, GET_CLIENT_AUTH_URL,
  SET_CLIENT_TOKEN_URL, ADD_CLIENT_URL } from '../utils/endpoints';
import { processData } from '../utils/common';

export default function Clients() {

  const { apiAuth } = useApiAuthContext();
  const token = apiAuth.token;
  const userId = localStorage.getItem('userId');

  const [rows, setRows] = React.useState([]);
  const [clientAuth, setClientAuth] = React.useState(
    {url: '', pin: ''});
  const [open, setOpen] = React.useState(false);
  const [clientId, setClientId] = React.useState(false);
  const [updatedClients, setUpdatedClients] = React.useState(0);
  const [openAddClient, setOpenAddClient] = React.useState(false);

  function getClients() {
    processData(GET_USER_CLIENTS_URL,
      token, setRows)
  }

  function getClientAuthUrl(clientId) {
    processData(`${GET_CLIENT_AUTH_URL}${clientId}/`,
      token, (data) => {
        setClientAuth({url: data.authorization_url, pin: ''})
      }
    )
  }

  function addClient(username) {
    processData(ADD_CLIENT_URL,
      token, ({username}) => {
        setUpdatedClients(prev => prev + 1);
      }, 'post', {username, owner: userId}
    )
  }

  function setClientToken(clientId, pin) {
    processData(SET_CLIENT_TOKEN_URL,
      token, ({pin, client_id: clientId}) => {
        setUpdatedClients(prev => prev + 1);
      }, 'post', {pin, client_id: clientId}
    )
  }

  const handleOpenPin = (clientId) => {
    setClientId(clientId);
    getClientAuthUrl(clientId);
    setOpen(true);
  };

  const handleOpenAddClient = (clientId) => {
    setOpenAddClient(true);
  };

  const handleClosePin = () => {
    setOpen(false);
  };

  const handleCloseAddClient = () => {
    setOpenAddClient(false);
  };

  const handleSubmitPin = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const pin = data.get('pin');
    const clientId = data.get('clientId');
    setClientToken(clientId, pin)
    handleClosePin();
  };

  const handleSubmitAddClient = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    addClient(username);
    handleCloseAddClient();
  };

  React.useEffect(() => {
    getClients();
  }, [apiAuth, updatedClients]);

  return (
    <React.Fragment>
      <Modal
        open={openAddClient}
        onClose={handleCloseAddClient}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 770,
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Paper style={{padding: '18px'}} elevation={3}>
            <h2 id="modal-title">Add client</h2>
            <p id="modal-description">
              Enter details to set up new client</p>
            <Box component="form" noValidate onSubmit={handleSubmitAddClient} sx={{ mt: 1 }}>
              <input type="hidden" name="clientId" value={clientId} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      required
                      id="username"
                      label="Username"
                      name="username"
                      autoFocus
                    />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >Add user</Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </div>
      </Modal>

      <Modal
        open={open}
        onClose={handleClosePin}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 770,
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Paper style={{padding: '18px'}} elevation={3}>
            <h2 id="modal-title">Authorize client</h2>
            <p id="modal-description">
              The client must authorize the app using the link below and
              provide the PIN code.</p>
            <Box component="form" noValidate onSubmit={handleSubmitPin} sx={{ mt: 1 }}>
              <input type="hidden" name="clientId" value={clientId} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      id="authorization_url"
                      label="Authorization URL"
                      name="authorization_url"
                      value={clientAuth.url}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                      margin="normal"
                      required
                      id="pin"
                      label="PIN"
                      name="pin"
                      autoFocus
                    />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >Authorize</Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </div>
      </Modal>


      <Title>Your Clients</Title>
      <Button variant="contained" sx={{ mt: 3, mb: 2, width: '200px' }}
        onClick={handleOpenAddClient}>Add new client</Button>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Authorized</TableCell>
            <TableCell>Manage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.username}</TableCell>
              <TableCell>{row.access_key ? "Yes" : "No"}</TableCell>
              <TableCell>
                {row.access_key ?
                  <Link to={`/dashboard/manage-tweets/${row.id}`}>
                    <Button variant="contained" sx={{ mt: 3, mb: 2 }}>Manage Tweets</Button>
                  </Link>
                  :
                  <Button variant="contained" sx={{ mt: 3, mb: 2 }}
                    onClick={() => handleOpenPin(row.id)}>Authorize</Button>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
