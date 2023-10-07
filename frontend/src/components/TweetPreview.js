import React from "react";
import Grid from '@mui/material/Grid';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import InputLabel from '@mui/material/InputLabel';

export default function TweetPreview({tweetPreview}) {

    return (
        <>
          <Grid item xs={12}>
            <InputLabel>Preview</InputLabel>
            <TextareaAutosize
              name='body'
              style={{ width: '100%', padding: '10px' }}
              minRows={3}
              value={tweetPreview}
              readOnly
            />
          </Grid>
        </>
    )
}