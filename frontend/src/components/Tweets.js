import axios from 'axios';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import Title from './Title';
import { useApiAuthContext  } from './ApiAuthContext';
import { GET_CLIENTS_URL, GET_CLIENT_TWEETS_URL,
  GET_INTERVAL_SCHEDULE_URL, MANAGED_TWEETS_URL } from '../utils/endpoints';
import { processData } from '../utils/common';


export default function Tweets() {

  const unselectedTweet = {
    id: 'add',
    name: '',
    body: '',
    interval_schedule: 0,
  }

  const { clientId } = useParams()

  const [username, setUsername] = React.useState('')
  const [tweets, setTweets] = React.useState([])
  const [tweetBody, setTweetBody] = React.useState('')
  const [selectedTweetId, setSelectedTweetId] = React.useState('add')
  const [selectedTweet, setSelectedTweet] = React.useState(unselectedTweet)
  const [tweetVariables, setTweetVariables] = React.useState([])
  const [tweetVariablesSequence, setTweetVariablesSequence
  ] = React.useState([0])
  const [tweetVariablesText, setTweetVariablesText] = React.useState('')
  const [allTweetVariables, setAllTweetVariables] = React.useState({})
  const [selectedInterval, setSelectedInterval] = React.useState(0)
  const [intervals, setIntervals] = React.useState([])

  const { apiAuth } = useApiAuthContext()
  const token = apiAuth.token

  const handleNameChange = (event) => {
    setSelectedTweet(prev => {
      return { ...prev, name: event.target.value}
    })
  }

  const handleBodyChange = (event) => {
    setSelectedTweet(prev => {
      return { ...prev, body: event.target.value}
    })
  }

  const handleIntervalChange = (event) => {
    setSelectedTweet(prev => {
      return { ...prev, interval_schedule: event.target.value}
    })
  }

  const handleTweetVariablesText = (event) => {
    setAllTweetVariables(
      { ...allTweetVariables, [event.target.id]: event.target.value })
  }

  const handleTweetVariablesSequence = (event) => {
    event.preventDefault();
    setTweetVariablesSequence([...tweetVariablesSequence, 0])
  };

  const handleTweetChange = (event) => {
    setSelectedTweetId(event.target.value);
  };

  function extractVariablesFromTemplate(fString) {
    const regex = /\{(\w+)\}/g;
    const matches = fString.match(regex);
    if (!matches) {
      return [];
    }
    const uniqueVariables = new Set(matches.map(match => match.substring(1, match.length - 1)));
    return Array.from(uniqueVariables);
  }

  const handleChangeTweetText = (event) => {
    const tweetBody = event.target.value;
    setTweetBody(tweetBody);
    const variables = extractVariablesFromTemplate(tweetBody);
    setTweetVariables(variables);
  }

  const handleSaveTweet = (event) => {
    event.preventDefault();
    console.log('save')
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const body = data.get('body');
    const owner = data.get('clientId');
    const submitData = { name, body, owner };
    const interval = data.get('interval');
    if (interval) submitData.interval_schedule = interval;
    console.log(submitData);
    saveTweet(submitData);
  }

  function getClient() {
    processData(`${GET_CLIENTS_URL}${clientId}`,
      token, (data) => setUsername(data.username))
  }

  function getTweets() {
    processData(`${GET_CLIENT_TWEETS_URL}${clientId}`,
      token, setTweets)
  }

  function getIntervals() {
    processData(GET_INTERVAL_SCHEDULE_URL,
      token, setIntervals)
  }

  function saveTweet(data) {
    processData(MANAGED_TWEETS_URL, token,
      (data) => console.log(data))
  }

  function loadSelectedTweet() {
    const tweet = (tweets.find(obj => obj.id === selectedTweetId) ||
      unselectedTweet);
    setSelectedTweet(tweet);
  }

  React.useEffect(() => {
    loadSelectedTweet()
  }, [selectedTweetId])

  React.useEffect(() => {
    getClient()
    getTweets()
    getIntervals()
  }, [apiAuth])

  return (
    <React.Fragment>
      <Title>Managed Tweets for {username}</Title>
      <Box component="form" noValidate onSubmit={handleSaveTweet} sx={{ mt: 1 }}>
      <input type="hidden" name="clientId" value={clientId} />
      <Grid container spacing={4}>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select tweet</InputLabel>
            <Select size="small" onChange={handleTweetChange} value={selectedTweetId}>
              <MenuItem key='add' value='add'>Add new tweet</MenuItem>
              {tweets.map((tweet) => (
                <MenuItem key={tweet.id} value={tweet.id}>{tweet.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Tweet name</InputLabel>
          <TextField
            size="small" name='name'
            value={selectedTweet.name}
            onChange={handleNameChange}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Tweet text</InputLabel>
          <TextareaAutosize
            name='body'
            onChange={handleChangeTweetText}
            style={{ width: '100%', padding: '10px' }}
            minRows={3}
            placeholder="Tweet text goes here. You can insert args using curly braces eg {arg1}"
            value={selectedTweet.body}
            onChange={handleBodyChange}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Tweet variables</InputLabel>
          <Table size="small">
            <TableHead>
              <TableRow>
                {tweetVariables.map((variable) => (
                  <TableCell key={variable}>{variable}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
            {tweetVariablesSequence.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {tweetVariables.map((variable, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <TextField id={`${cellIndex}-${rowIndex}-${variable}`} className="tweet-variable"
                      onChange={handleTweetVariablesText} size="small" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {tweetVariables.length ?
            <TableRow><TableCell>
              <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleTweetVariablesSequence}>
                Add tweet variables</Button>
            </TableCell></TableRow> : null}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Interval</InputLabel>
          <Select
            name="interval"
            size="small"
            onChange={handleIntervalChange}
            value={selectedTweet.interval_schedule}>
            <MenuItem key={0} value={0}>Send immediately</MenuItem>
            {intervals.map((interval) => (
              <MenuItem key={interval.id} value={interval.id}>Every {interval.every} {interval.period}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} >
                Save tweet</Button>
        </Grid>
      </Grid>
      </Box>
    </React.Fragment>
  );
}
