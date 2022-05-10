import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getCurrentUserProfile } from '../spotify';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  console.log(profile)

  useEffect(() => {
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
    <>
      {profile && (
        <div>
          <h1>{profile.display_name}</h1>
          <p>{profile.followers.total} Followers</p>
          <a href="/playlists">Playlists</a>
          {profile.images.length && profile.images[0].url && (
            <img src={profile.images[0].url} alt="Avatar"/>
          )}
        </div>
      )}
    </>
  )
};

export default Profile;