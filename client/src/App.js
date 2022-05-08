import './App.css';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    // grabs the query string (everything after the '?')
    const queryString = window.location.search;

    // creates & returns a new URLSearchParams object which contains utility methods like .get()
    const urlParams = new URLSearchParams(queryString);

    // grab the access token and refresh tokens from the query string
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    console.log('access:', accessToken);
    console.log('refresh:', refreshToken);

    if (refreshToken) {
      fetch(`/refresh_token?refresh_token=${refreshToken}`)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
    }
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <a className="App-link" href="http://localhost:8888/login">
            Log in to Spotify
        </a>
      </header>
    </div>
  );
}

export default App;
