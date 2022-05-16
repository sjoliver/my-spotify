import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { catchErrors } from '../utils';
import { getCurrentUserPlaylists } from '../spotify';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  
  let playlistsList = [];
  let playlistID = [];
  let allTracks = {};
  let options;
  
  if (playlists.length > 1) {
    // create array of playlist ids
    for (let playlist of playlists.items) {
      playlistID.push(playlist.id)
    }

    options = playlists.items.map(playlist => playlist.name)
  }
  
  // create array equal to the length of the number of checkboxes using the array "fill" method
  const [checkedState, setCheckedState] = useState(
    playlists.length > 1 ? new Array(options.length).fill(false) : []
  );

  // create array of playlistEndpoints using their IDs
  let playlistEndpoints = playlistID.map(id => `/playlists/${id}`);

  // concurrently make an axios get requests for each endpoint 
  const getTracksTEST = async () => {
    try {
      const playlists = await axios.all(playlistEndpoints.map((endpoint) => axios.get(endpoint)))
      
      // loop through each playlist
      for (let playlist of playlists) {

        // playlist.data.tracks.items = array of track objects
        let trackObj = playlist.data.tracks.items; 

        for (const song of trackObj) {
          if (song.track.id in allTracks) {
            allTracks[`${song.track.id}`][1] += 1
          } else {
            allTracks[`${song.track.id}`] = [song.track.name, 1]
          }
        }
      }
      
      const allTracksArr = Object.values(allTracks);
      const sortedTracks = allTracksArr.sort((a, b) => b[1] - a[1]);

      setTopSongs(sortedTracks.slice(0,20));

    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    // getCurrentUserPlaylists returns a promise, we must use await to wait for the promise to be resoled -- we handle this by creating an async fn 
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();

      setPlaylists(data);
    };

    // handles errors from async fn 
    catchErrors(fetchData());

    getTracksTEST();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    const updatedCheckedState = checkedState.map((item, index) => 
      index === event ? !item : item
    );

    setCheckedState(updatedCheckedState);
  }

  if (playlists.length > 1) {
    // create array of playlist names
    playlistsList = playlists.items.map((playlist, index) => {
      return (
        <div key={index}>
          <FormControlLabel 
            control={<Checkbox checked={checkedState[index]} onChange={() => handleChange(index)}/>} 
            label={`${playlist.name}`} 
          />
        </div>
      )
    })
  }

  let topSongsList;

  if (topSongs.length > 1) {
    // create array of playlist names
    topSongsList = topSongs.map((topSong, index) => {
      return <li key={index}>{topSong[0]}: {topSong[1]}</li>
    });
  };

  return (
    <>
      <FormGroup>
        {playlistsList}
      </FormGroup>
      <ol>
        {topSongsList}
      </ol>
    </>
  )

}

export default Playlists;