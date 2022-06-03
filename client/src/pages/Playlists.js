import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

import { catchErrors } from '../utils';
import { getCurrentUserPlaylists } from '../spotify';

import '../styles/Playlists.css'

const Playlists = () => {
  const [playlists, setPlaylists] = useState();
  const [checkedState, setCheckedState] = useState(new Array(10).fill(false));
  const [checkedPlaylists, setCheckedPlaylists] = useState({});
  const [topSongs, setTopSongs] = useState();

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

  // function to run after submit button is clicked
  // grabs selected playlists' data, counts duplicate records and sets the top songs state array
  const handleSubmit = (event) => {
    event.preventDefault();

    let allTracks = {};

    // concurrent GET requests using axios for each endpoint 
    const getTracks = async () => {
      
      // playlists = array of playlist objects
      const playlists = await axios.all(playlistEndpoints.map((endpoint) => axios.get(endpoint)));

      // loop through each playlist
      for (let playlist of playlists) {

        // playlist.data.tracks.items = array of track objects
        let trackArr = playlist.data.tracks.items; 

        for (const song of trackArr) {
          if (allTracks[song.track.id]) {
            allTracks[song.track.id][1] += 1
          } else {
            allTracks[song.track.id] = [song.track.name, 1, song.track.album.images[2].url,song.track.artists[0].name]
          }
        }
      }

      // create array of song.name/count arrays
      const allTracksArr = Object.values(allTracks);

      // create new array that's sorted by highest to lowest count
      const sortedTracks = allTracksArr.sort((a, b) => b[1] - a[1]);
  
      // set top songs state array and slice it at 20 element
      setTopSongs(sortedTracks.slice(0,10));
    }
    catchErrors(getTracks());
  }

  console.log('playlists', playlists)

  const [selectedOption, setSelectedOption] = useState(null);

  const options = playlists?.items.map(playlist => {
    const container = {};
    container.value = playlist.name
    container.label = playlist.name
    return container
  })

  console.log("OPTIONS",options)

  return (
    <>
      <h2 id='page-title'>Playlist Analysis</h2>
      <div className='content-container'>
        <div className='form-wrapper'>
          <h2 className='titles'>Select Playlists</h2>
          <form onSubmit={handleSubmit} className='form'>
            {playlists && 
              <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
              />
            }
          </form>


          <form onSubmit={handleSubmit} className='form'>
            <ul className='playlists-list'>
              {playlists?.items.map((playlist, index) => {
                return (
                  <li key={playlist + index} className='playlists-list-item'>
                    <input 
                      type='checkbox'
                      className='checkbox-item'
                      id={`custom-checkbox-${index}`}
                      name={playlist.name}
                      value={playlist.name}
                      checked={checkedState[index]}
                      onChange={() => handleChange(index, playlist.id)}
                    />
                    <label htmlFor={`custom-checkbox-${index}`}>
                      <img className='album-cover-img' src={playlist.images[2].url} alt='Playlist Cover'/>
                      {playlist.name}
                    </label>
                  </li>
                )
              })}
            </ul>
            <button className='submit-btn' type='submit'>Analyze</button>
          </form>
        </div>
        {topSongs && 
          <div className='topsongs-list-wrapper'>
            <h2 className='titles' id='topsongs-title'>Top Songs</h2>
            <div className='topsongs-container'>
              {topSongs?.map((topSong, index)=> {
                  return (
                    <div key={topSong+index} role="row" className='track-row-wrapper'>
                      <div className='track-row'>
                        <div className='rank-number'><strong>{index + 1}</strong></div>
                        <div className='album-cover'><img className='album-cover-img' src={topSong[2]} alt='Album Cover'/></div>
                        <div className='track'>
                          <div className='track-title'>{topSong[0]}</div>
                          <div className='track-artist'>{topSong[3]}</div>
                        </div>
                        <div className='count-number'>{topSong[1]}</div>
                      </div>
                    </div>
                  )
              })}
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default Playlists;