import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Select from 'react-select'

import { catchErrors } from '../utils';
import { getCurrentUserPlaylists } from '../spotify';

import '../styles/Playlists.css'


const Playlists = () => {
  const [playlists, setPlaylists] = useState();
  const [topSongs, setTopSongs] = useState();
  const [selectedOption, setSelectedOption] = useState();

  const options = playlists?.items.map(playlist => {
    const container = {};
    container.value = playlist.name
    container.label = playlist.name
    return container
  });

  const handleChange = (event) => {
    let value = Array.from(event.target.options).filter(o => o.selected).map(o => o.value)

    setSelectedOption(value);
  }

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

  // create array of playlist IDs > use playlist ID array to create endpoint array 
  let playlistIds = Object.values(selectedOption);
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

  return (
    <>
      <h2 id='page-title'>Playlist Analysis</h2>
      <div className='content-container'>
        <div className='form-wrapper'>
          <h2 className='titles'>Select Playlists</h2>
          <form onSubmit={handleSubmit} className='form'>
            <Select 
              defaultValue={selectedOption}
              onChange={handleChange}
              options={options} 
              isMulti
              name='playlists'
            />
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