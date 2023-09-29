import * as React from 'react';
import Grid from '@mui/material/Grid';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


export default function TweetBody({selectedTweet, setSelectedTweet}) {

  const [tweetVariables, setTweetVariables] = React.useState([])

  const handleBodyChange = (event) => {
    setSelectedTweet(prev => {
      return { ...prev, body: event.target.value }
    })
  }

  const handleTweetVariablesText = (event, rowIndex, variableName) => {
    setSelectedTweet(prev => {
      prev.body_template_data[rowIndex][variableName] = event.target.value
      return { ...prev }
    })
  }

  const handleAddTweetVariables = (event) => {
    event.preventDefault();
    setSelectedTweet(prev => {
      const data = prev.body_template_data
      const length = data.length;
      const newRow = tweetVariables.reduce((row, key) => {
        row[key] = '';
        return row;
      }, {});
      data.push(newRow);
      return { ...prev, body_template_data: data }
    })
  }

  const renderExtractedVariables = () => {
    const variables = extractVariablesFromTemplate(
      selectedTweet.body);
    setTweetVariables(variables);
  }

  React.useEffect(() => {
    renderExtractedVariables()
    //console.log(selectedTweet.body_template_data)
  }, [selectedTweet.body])

  function extractVariablesFromTemplate(fString) {
    const regex = /\{(\w+)\}/g;
    const matches = fString.match(regex);
    if (!matches) {
      return [];
    }
    const uniqueVariables = new Set(matches.map(
      match => match.substring(1, match.length - 1)));
    return Array.from(uniqueVariables);
  }

  return (
    <>
      <Grid item xs={12}>
        <InputLabel>Tweet text</InputLabel>
        <TextareaAutosize
          name='body'
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
          {tweetVariables.map((variableName) => (
            <TableCell key={variableName}>{variableName}</TableCell>
          ))}
          </TableRow>
        </TableHead>
        <TableBody>
        {selectedTweet?.body_template_data?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
          {tweetVariables.map((variableName, cellIndex) => (
            <TableCell key={cellIndex}>
            <TextField id={`${cellIndex}-${rowIndex}-${variableName}`} className="tweet-variable"
              onChange={(event) => handleTweetVariablesText(event, rowIndex, variableName)}
              value={row?.[variableName] || ''}
              size="small" />
            </TableCell>
          ))}
          </TableRow>
        ))}
        {tweetVariables.length ?
        <TableRow><TableCell>
          <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleAddTweetVariables}>
          Add tweet variables</Button>
        </TableCell></TableRow> : null}
        </TableBody>
        </Table>
      </Grid>
    </>
  )
}