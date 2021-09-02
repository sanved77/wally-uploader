import './App.css';
import Chaalni from './comp/Chaalni';
import Categorizer from './comp/Categorizer';
import React, { useState } from 'react';

function App() {

  const [links, setLinks] = useState([]);
  const [dash, setDash] = useState(1)

  const grabImages = (datLinks) => {
    setLinks(datLinks);
    setDash(2);
  }

  return (
    <div className="App"> 
      {dash === 1 && <Chaalni grabImages={grabImages}/>}
      {dash === 2 && <Categorizer links={links}/>}
    </div>
);
}

export default App;
