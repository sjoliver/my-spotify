import React, { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getCurrentUserProfile } from '../spotify';
import '../styles/Profile.css'

const Profile = () => {
  const [profile, setProfile] = useState(null);

  // console.log(profile.images)

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
        <div className='profile-wrapper'>
          {profile.images.length && profile.images[0].url && (
            <div className='profile-img-wrapper'>
              <img className='profile-img' src={profile.images[0].url} alt="Avatar"/>
            </div>
          )}
          <div>
            <h1>{profile.display_name}</h1>
            <p>{profile.followers.total} Followers</p>
          </div>
          <a href="/playlists">Playlists</a>
        </div>
      )}
    </>
  )
};

export default Profile;