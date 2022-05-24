import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopSongs = (props) => {
  const [topSongs, setTopSongs] = useState([]);
  const {playlists} = props

  let playlistID = [];
  let allTracks = {};
  
  // create array of playlist ids
  if (playlists) {
    for (let playlist of playlists.items) {
      playlistID.push(playlist.id)
    }
  }

  // create array of playlist endpoints using their IDs
  let playlistEndpoints = playlistID.map(id => `/playlists/${id}`);

  // concurrent GET requests using axios for each endpoint 
  const getTracks = async () => {
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
    getTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let topSongsList;

  if (playlists) {

     // LIST OF TOP SONGS
     topSongsList = topSongs.map((topSong, index) => {
      return <li key={index}>{topSong[0]}: {topSong[1]}</li>
    });

    console.log("top songs", topSongsList)
  }


  return (
    <>
      <ol>
        {topSongsList}
      </ol>
    </>
  )


}

export default TopSongs;