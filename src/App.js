import './App.css';
import Chaalni from './comp/Chaalni';
import Categorizer from './comp/Categorizer';
import React, { useState } from 'react';

function App() {

  const [links, setLinks] = useState([]);
  const [dash, setDash] = useState(1);
  const [colName, setColName] = useState('');

  const grabImages = (datLinks, datColName) => {
    setLinks(datLinks);
    setDash(2);
    setColName(datColName);
  }

  return (
    <div className="App"> 
      {dash === 1 && <Chaalni grabImages={grabImages}/>}
      {dash === 2 && <Categorizer links={links} colName={colName}/>}
    </div>
);
}

export default App;
