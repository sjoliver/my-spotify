import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { accessToken, logout } from './spotify';
import { Login, Profile, Playlists } from './pages';
import { GlobalStyle } from './styles';
import styled from 'styled-components/macro';

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

// scroll to top of page when changing routes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0,0);
  }, [pathname]);

  return null;
};

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
            <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/" element={<Profile />} />
              </Routes>
            </Router>
          </>
        )}
    </div>
  );
}

export default App;
