// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useState, useEffect, useRef} from 'react';

function useLocalStorageState(
  key,
  defaultValue = null,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  // option method to serialize deserialize with JSON being the default option

  const [state, setState] = useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    } else
      return (
        // lazy read of defaultValue
        typeof defaultValue === 'function' ? defaultValue() : defaultValue
      );
  });

  // keep track of the previous Key and change it if needed
  const prevKeyRef = useRef(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, serialize, state]);

  return [state, setState];
}

function Greeting() {
  const [name, setName] = useLocalStorageState('name', '');

  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  );
}

function App() {
  return <Greeting />;
}

export default App;
