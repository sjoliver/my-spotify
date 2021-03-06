import React from 'react';
import '../styles/TopSongs.css'

const TopSongs = ({ topSongs }) => {

  return (
    <>
      {topSongs && 
        <div className='topsongs-list-wrapper'>
          <h1 className='titles' id='topsongs-title'>Top Songs</h1>
          <div className='topsongs-headers'>
            <div className='rank-header'>#</div>
            <div className='track-header'>TITLE</div>
            <div className='count-header'>COUNT</div>
          </div>
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
    </>
  )
}

export default TopSongs;