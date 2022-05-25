import React, { useEffect, useState } from 'react';

import TopSongs from './TopSongs';
import { catchErrors } from '../utils';
import { getCurrentUserPlaylists } from '../spotify';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Playlists = () => {
  const [playlists, setPlaylists] = useState();
  const [checkedState, setCheckedState] = useState(
    new Array(20).fill(false)
  );
  const [checkedPlaylists, setCheckedPlaylists] = useState([]);

  useEffect(() => {
    // getCurrentUserPlaylists returns a promise, we must use await to wait for the promise to be resolved -- we handle this by creating an async fn 
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();

      setPlaylists(data);
    };

    fetchData();

    // handles errors from async fn 
    catchErrors(fetchData());

  }, []);

  const handleChange = (position, id) => {
    const updatedCheckedState = checkedState.map((item, index) => 
      index === position ? !item : item
    );

    if (checkedState[position] === false) {
      setCheckedPlaylists((prev) => [...prev, id])
    } else {
      for (let i = 0; i < checkedPlaylists.length; i++) {
        if (checkedPlaylists[i] === id) {
          setCheckedPlaylists((prev) => [...prev].splice(i, 1))
        }
      }
    }

    setCheckedState(updatedCheckedState);
  }

  console.log('playlist ids', checkedPlaylists)

  return (
    <>
      <FormGroup>
        {playlists?.items.map((playlist, index) => {
          return (
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={checkedState[index]} 
                  onChange={() => handleChange(index, playlist.id)}
                />
              } 
              label={`${playlist.name}`} 
              key={index}
            />
          )
        })}
      </FormGroup>
      <TopSongs playlists={playlists} />
    </>
  )
}

export default Playlists;