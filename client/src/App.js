// import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { accessToken, logout, getCurrentUserProfile } from './spotify';
import { catchErrors } from './utils';
import styled, { createGlobalStyle } from 'styled-components/macro'; // use /macro to enable the Babel plugin

const StyledLoginButton = styled.a`
  background-color: green;
  color: white;
  padding: 10px 20px;
  margin: 20px auto;
  border-radius: 30px;
  display: inline-block;
`;

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: black;
    color: white;
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
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    // getCurrentUserProfile returns a promise, we must use await to wait for the promise to be resoled -- we handle this by creating an async fn 
    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();

      // set the state variable with the response from the axios.get('/me')
      setProfile(data);
    };

    // handles errors from async fn 
    catchErrors(fetchData());
  }, []);


  return (
    <div className="App">
      <GlobalStyle />

      <header className="App-header">
        {!token ? (
          <StyledLoginButton className="App-link" href="http://localhost:8888/login">
            Log in to Spotify
          </StyledLoginButton>
        ) : (
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/playlists/:id" element={<h1>Playlist</h1>} />
              <Route path="/playlists" element={<h1>Playlists</h1>} />
              <Route path="/" element={
                <>
                  <button onClick={logout}>Log Out</button>
                  {profile && (
                    <div>
                      <h1>{profile.display_name}</h1>
                      <p>{profile.followers.total} Followers</p>
                      {profile.images.length && profile.images[0].url && (
                        <img src={profile.images[0].url} alt="Avatar"/>
                      )}
                    </div>
                  )}
                </>
              } />
            </Routes>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;
