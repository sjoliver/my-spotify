import './App.css';
import { useEffect, useState } from 'react';
import { accessToken, logout, getCurrentUserProfile } from './spotify';

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    // getCurrentUserProfile returns a promise, we must use await to wait for the promise to be resoled -- we handle this by creating an async fn 
    const fetchData = async () => {
      try {
        const { data } = await getCurrentUserProfile();

        // set the state variable with the response from the axios.get('/me')
        setProfile(data);
      } catch(e) {
        console.log(e)
      }
    };

    fetchData();
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8888/login">
            Log in to Spotify
          </a>
        ) : (
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
        )}
      </header>
    </div>
  );
}

export default App;
