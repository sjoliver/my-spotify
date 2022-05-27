import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

import TopSongs from './TopSongs';
import { catchErrors } from '../utils';
import { getCurrentUserPlaylists } from '../spotify';

const Playlists = () => {
  const [playlists, setPlaylists] = useState();
  const [checkedState, setCheckedState] = useState(new Array(20).fill(false));
  const [checkedPlaylists, setCheckedPlaylists] = useState([]);
  const { handleSubmit } = useForm();
  const onSubmit = data => console.log(data);

  useEffect(() => {
    // getCurrentUserPlaylists returns a promise, we must use await to wait for the promise to be resolved -- we handle this by creating an async fn 
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();

      setPlaylists(data);
    };

    fetchData();

    // handles errors from async fn 
    catchErrors(fetchData());

  }, []);

  const handleChange = (position, id) => {
    const updatedCheckedState = checkedState.map((item, index) => 
      index === position ? !item : item
    );

    if (checkedState[position] === false) {
      setCheckedPlaylists((prev) => [...prev, id])
    } else {
      for (let i = 0; i < checkedPlaylists.length; i++) {
        if (checkedPlaylists[i] === id) {
          setCheckedPlaylists((prev) => [...prev].splice(i, 1))
        }
      }
    }

    setCheckedState(updatedCheckedState);
  }

  return (
    <>
      <h3>Select Playlists</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul className='playlists-list' style={{"list-style": "none"}}>
          {playlists?.items.map((playlist, index) => {
            return (
              <li key={index}>
                <div className='playlists-list-item'>
                  <input 
                    type='checkbox'
                    id={`custom-checkbox-${index}`}
                    name={playlist.name}
                    value={playlist.name}
                    checked={checkedState[index]}
                    onChange={() => handleChange(index, playlist.id)}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{playlist.name}</label>
                </div>
              </li>
            )
          })}
        </ul>
        <div>
          <button className='submit-btn' type='submit'>Submit</button>
        </div>
      </form>
      <TopSongs playlists={playlists} />
    </>
  )
}

export default Playlists;