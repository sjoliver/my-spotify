import React, { useEffect, useState } from 'react';

import { accessToken, logout } from './spotify';
import { Login, Profile, Playlists } from './pages';

import { GlobalStyle } from './styles';
import './styles/App.css'

import { BsSpotify } from 'react-icons/bs'

// // scroll to top of page when changing routes
// function ScrollToTop() {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0,0);
//   }, [pathname]);

//   return null;
// };

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken)
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
        {!token ? (
          <Login />
        ) : (
          <>
          <section className='top-bar'>
            <div className='app-header-wrapper'>
              <BsSpotify size={36} color={'#1ed760'} />
              <p id='app-header'>Spotify Playlist Analytics</p>
            </div>
            <div className='profile-logout'>
              <Profile />
              <button onClick={logout}>Log Out</button>
            </div>
          </section>
            <Playlists />
          </>
        )}
    </div>
  );
}

export default App;
