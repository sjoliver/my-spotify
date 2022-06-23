import React, { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getCurrentUserProfile } from '../spotify';
import '../styles/Profile.css'
import { SiEgghead } from 'react-icons/si'

const Profile = () => {
  const [profile, setProfile] = useState(null);

    // getCurrentUserProfile returns a promise, we must use await to wait for the promise to be resoled -- we handle this by creating an async fn 
  const fetchData = async () => {
    const { data } = await getCurrentUserProfile();
    // set the state variable with the response from the axios.get('/me')
    setProfile(data);
  };

  useEffect(() => {
    fetchData();

    // handles errors from async fn 
    catchErrors(fetchData());
  }, []);

  return (
    <>
      {profile && (
        <div className='profile-wrapper'>
          <div className='name-followers'>
            <p id='display-name'>{profile.display_name}</p>
          </div>
          {profile.images[0] ? 
            <div className='profile-img-wrapper'>
              <img className='profile-img' src={profile.images[0].url} alt="Avatar"/>
            </div>
            :
            <div className='egghead-wrapper'>
              <SiEgghead size={28}/>
            </div>
          }
        </div>
      )}
    </>
  )
};

export default Profile;