import React, { useEffect, useState } from 'react';

import { accessToken, logout } from './spotify';
import { Login, Profile, Playlists } from './pages';

import { GlobalStyle } from './styles';
import styled from 'styled-components/macro';
import './styles/App.css'

import { BsSpotify } from 'react-icons/bs'

const StyledLogoutButton = styled.button`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

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
              <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
            </div>
          </section>
            <Playlists />
          </>
        )}
    </div>
  );
}

export default App;
