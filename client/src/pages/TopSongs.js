import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { catchErrors } from '../utils';

const TopSongs = (props) => {
  const [topSongs, setTopSongs] = useState([]);
  const {playlists} = props;

  let playlistID = [];
  
  // create array of playlist ids
  if (playlists) {
    for (let playlist of playlists.items) {
      playlistID.push(playlist.id)
    }
  }

  // create array of playlist endpoints using their IDs
  let playlistEndpoints = playlistID.map(id => `/playlists/${id}`);

  
  useEffect(() => {
    // console.log("hey")

    let allTracks = {};

    // concurrent GET requests using axios for each endpoint 
    const getTracks = async () => {
      
      const playlists = await axios.all(playlistEndpoints.map((endpoint) => axios.get(endpoint)))
      
      // console.log("SUP")

      // loop through each playlist
      for (let playlist of playlists) {

        // playlist.data.tracks.items = array of track objects
        let trackObj = playlist.data.tracks.items; 
        // console.log("YO")

        for (const song of trackObj) {
          if (song.track.id in allTracks) {
            allTracks[`${song.track.id}`][1] += 1
          } else {
            allTracks[`${song.track.id}`] = [song.track.name, 1]
          }
        }
      }

      // console.log("FUCK")
      
      const allTracksArr = Object.values(allTracks);
      const sortedTracks = allTracksArr.sort((a, b) => b[1] - a[1]);

      setTopSongs(sortedTracks.slice(0,20));
    }

    // console.log("SHIT")

    catchErrors(getTracks())

    getTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("UR MOM")

  return (
    <div>
      <ol>
        {playlists ? topSongs.map((topSong, index) => {
          return <li key={index}>{topSong[0]}: {topSong[1]}</li>
        }): []}
      </ol>
    </div>
  )
}

export default TopSongs;