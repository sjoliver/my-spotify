import React, { useEffect, useState } from 'react';
import axios from 'axios';

// import TopSongs from './TopSongs';
import { catchErrors } from '../utils';
import { getCurrentUserPlaylists } from '../spotify';

const Playlists = () => {
  const [playlists, setPlaylists] = useState();
  const [checkedState, setCheckedState] = useState(new Array(20).fill(false));
  const [checkedPlaylists, setCheckedPlaylists] = useState({});
  const [topSongs, setTopSongs] = useState([]);

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

    setCheckedState(updatedCheckedState);

    // if box is checked, add id to state
    // if box is unchecked, remove id from state 
    if (updatedCheckedState[position]) {
      setCheckedPlaylists(prev => {
        return {
          ...prev,
          [position]: id
        }
      })
    } else {
      setCheckedPlaylists(prev => {
        delete checkedPlaylists[position]
        return { ...prev }
      })
    }
  }

  let playlistIds = Object.values(checkedPlaylists)
  let playlistEndpoints = playlistIds.map(id => `/playlists/${id}`);

  const handleSubmit = (event) => {
    event.preventDefault();

    let allTracks = {};

    // concurrent GET requests using axios for each endpoint 
    const getTracks = async () => {
      
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
    }

    catchErrors(getTracks())

    getTracks();
  }

  console.log("**", topSongs)

  return (
    <>
      <h3>Select Playlists</h3>
      <form onSubmit={handleSubmit}>
        <ul className='playlists-list' style={{"listStyle": "none"}}>
          {playlists?.items.map((playlist, index) => {
            return (
              <li key={index}>
                <div className='playlists-list-item'>
                  <input 
                    type='checkbox'
                    id={`custom-checkbox-${index}`}
                    name={playlist.name}
                    value={playlist.name}
                    checked={checkedState[index]}
                    onChange={() => handleChange(index, playlist.id)}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{playlist.name}</label>
                </div>
              </li>
            )
          })}
        </ul>
        <div>
          <button className='submit-btn' type='submit'>Submit</button>
        </div>
      </form>
      <div>
      <ol>
        {playlists ? topSongs.map((topSong, index) => {
          return <li key={index}>{topSong[0]}: {topSong[1]}</li>
        }): []}
      </ol>
    </div>
    </>
  )
}

export default Playlists;