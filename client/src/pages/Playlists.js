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
  let playlistEndpoints = playlistID.map(id => `/playlists/${id}`);

  // concurrently make an axios get requests for each endpoint 
  const getTracks = axios.all(playlistEndpoints.map((endpoint) => axios.get(endpoint)))
    .then((playlists) => {

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
      return allTracksArr;
      
    }).catch(error => console.log(error));

    const top20 = async () => {
      const trackArr = await getTracks;
      const sortedTracks = trackArr.sort((a, b) => b[1] - a[1]);
      console.log(sortedTracks.slice(0, 20));
      return sortedTracks.slice(0, 20)
    };

    top20();

    // let top20List;

    // if (top20[0]) {
    //   top20List = top20.map((track, index) => {
    //     return <li key={index}>{track[0]}: {track[1]}</li>
    //   })
    // }

  return (
    <>
      <ul>
        {playlistsList}
      </ul>
    </>
  )

}

export default Playlists;