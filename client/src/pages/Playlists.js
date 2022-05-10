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

  const playlistObj = {
    playlist1: {id: "track name", id2: "track name"},
    playlist2: {id: "track name", id2: "track name"},
    playlist3: {id: "track name", id2: "track name"},
  }

  const trackObj = {
    trackId1: ["track name", "count"],
    trackId2: ["track name", "count"],
    trackId3: ["track name", "count"],
  }

  if (playlists) {

    playlistsList = playlists.items.map((playlist, index) => {
      return <li key={index}>{playlist.name}</li>
    })

    // loop through playlists to grab a single playlist
    for (let playlist of playlists.items) {
      console.log("playlist:", playlist)

      // get tracks from playlists
      let playlistTracks = () => axios.get(`/playlists/${playlist.id}`);

      // loop through tracks in each playlist
      // if the track id exists in the object, increment the value
      // if the track id does not exist in the object, add it to the object with the value of 1


    }


    // () => axios.get(`/playlists/${playlist.id}`);
 
  }

  return (
    <>
      <ul>
        {playlistsList}
      </ul>
    </>
  )

}

export default Playlists;