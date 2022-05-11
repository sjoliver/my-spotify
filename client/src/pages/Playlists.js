import { useState, useEffect } from 'react';
import axios from 'axios';
import { catchErrors } from '../utils';
import { getCurrentUserPlaylists } from '../spotify';

const Playlists = () => {
  const [playlists, setPlaylists] = useState(null);

  let playlistsList = [];

  useEffect(() => {
    // getCurrentUserPlaylists returns a promise, we must use await to wait for the promise to be resoled -- we handle this by creating an async fn 
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();

      setPlaylists(data);
    };

    // handles errors from async fn 
    catchErrors(fetchData());
  }, []);

  let playlistID = [];

  if (playlists) {
    // create array of playlist ids
    for (let playlist of playlists.items) {
      playlistID.push(playlist.id)
    }

    // create array of playlist names
    playlistsList = playlists.items.map((playlist, index) => {
      return <li key={index}>{playlist.name}</li>
    })
  }

  let allTracks = {};

  // create array of playlistEndpoints using their IDs
  const playlistEndpoints = playlistID.map(id => `/playlists/${id}`);

  // concurrently make an axios get requests for each endpoint 
  axios.all(playlistEndpoints.map((endpoint) => axios.get(endpoint)))
    .then((response) => {

      // loop through each playlist
      for (let playlist of response) {

        // playlist.data.tracks.items = array of track objects
        let trackObj = playlist.data.tracks.items; 

        for (const song of trackObj) {
          if (song.track.id in allTracks) {
            allTracks[song.track.id][1] += 1
          } else {
            allTracks[song.track.id] = [song.track.name, 1]
          }
        }
      }

    }).catch(error => console.log(error));

    const allTracksArr = Object.values(allTracks);
    console.log("hii", Object.values(allTracks))
    console.log(allTracksArr); 


  return (
    <>
      <ul>
        {playlistsList}
      </ul>
    </>
  )

}

export default Playlists;