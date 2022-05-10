// import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { accessToken, logout, getCurrentUserProfile } from './spotify';
import { catchErrors } from './utils';
import { Login } from './pages';
import { GlobalStyle } from './styles';

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

  return (
    <div className="App">
      <GlobalStyle />

      <header className="App-header">
        {!token ? (
          <Login />
        ) : (
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/playlists/:id" element={<h1>Playlist</h1>} />
              <Route path="/playlists" element={<h1>Playlists</h1>} />
              <Route path="/" element={<button onClick={logout}>Log Out</button>} />
            </Routes>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;
