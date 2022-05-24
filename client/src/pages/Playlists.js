import React, { useEffect, useState } from 'react';

import TopSongs from './TopSongs';
import { catchErrors } from '../utils';
import { getCurrentUserPlaylists } from '../spotify';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // getCurrentUserPlaylists returns a promise, we must use await to wait for the promise to be resolved -- we handle this by creating an async fn 
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();

      setPlaylists(data);
    };

    // handles errors from async fn 
    catchErrors(fetchData());

  }, []);

  console.log("PLAYLISTS", playlists)

  return (
    <>
      <FormGroup>
        {playlists?.items.map((playlist, index) => {
          return (
            <FormControlLabel control={<Checkbox />} label={`${playlist.name}`} key={index} />
        )
        })}
      </FormGroup>
      <TopSongs playlists={playlists} />
    </>
  )

}

export default Playlists;