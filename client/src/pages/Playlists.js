import React, { useEffect, useState } from 'react';
import axios from 'axios';

// import TopSongs from './TopSongs';
import { catchErrors } from '../utils';
import { getCurrentUserPlaylists, getTestPlaylists } from '../spotify';

const Playlists = () => {
  const [playlists, setPlaylists] = useState();
  const [test, setTest] = useState();
  const [checkedState, setCheckedState] = useState(new Array(20).fill(false));
  const [checkedPlaylists, setCheckedPlaylists] = useState({});
  const [topSongs, setTopSongs] = useState([]);

  useEffect(() => {
    // getCurrentUserPlaylists returns a promise, we must use await to wait for the promise to be resolved -- we handle this by creating an async fn 
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();

      setPlaylists(data);
    };

    const testData = async () => {
      const { data } = await getTestPlaylists();

      setTest(data);
    }

    fetchData();

    testData();

    // handles errors from async fn 
    catchErrors(fetchData());
    catchErrors(testData());

  }, []);

  const handleChange = (position, id) => {

    // when a box is a checked, a new array for state is created
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

  // create array of playlist IDs > use playlist ID array to create endpoint array 
  let playlistIds = Object.values(checkedPlaylists)
  let playlistEndpoints = playlistIds.map(id => `/playlists/${id}`);

  const handleSubmit = (event) => {
    event.preventDefault();

    let allTracks = {};

    // concurrent GET requests using axios for each endpoint 
    const getTracks = async () => {
      
      // get playlists
      // playlists = array of playlist objects
      const playlists = await axios.all(playlistEndpoints.map((endpoint) => axios.get(endpoint)))

      console.log("playlists", playlists)

  
      // put playlist songs into array

      // count duplicates 

      const playlistArr = [];

      for (let playlist of playlists) {

        playlistArr.push(playlist.data.tracks.items)

      }



      
      // loop through each playlist
      for (let playlist of playlists) {

        // playlist.data.tracks.items = array of track objects
        let trackObj = playlist.data.tracks.items; 

        for (const song of trackObj) {
          if (allTracks[song.track.id] === undefined) {
            allTracks[`${song.track.id}`] = [song.track.name, 1]
          } else {
            allTracks[`${song.track.id}`][1] += 1
          }
        }
      }

      console.log("**", allTracks)
      
      const allTracksArr = Object.values(allTracks);
      const sortedTracks = allTracksArr.sort((a, b) => b[1] - a[1]);

      setTopSongs(sortedTracks.slice(0,20));
    }

    catchErrors(getTracks())

    getTracks();
  }

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