import React, { useEffect, useState } from 'react';

import { accessToken, logout } from './spotify';
import { Login, Profile, Playlists } from './pages';

import { GlobalStyle } from './styles';
import styled from 'styled-components/macro';
import './styles/App.css'

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
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
          <div className='top-bar'>
            <Profile />
            <h1 id='app-header'>Playlist Analysis</h1>
            <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
          </div>
            <Playlists />
          </>
        )}
    </div>
  );
}

export default App;
