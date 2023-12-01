import React from 'react';
import Sidebar1 from './Sidebar1';
import Chatcontainer from './Chatcontainer';
import "./Chatpage.css";

const Chatpage = ({currentUser, signOut}) => {
  return (
    <div className='chatpage'>
      <div className='chatpage-container'>
     <Sidebar1 currentUser={currentUser} signOut={signOut}/>
     <Chatcontainer currentUser={currentUser}/>
    </div>
    </div>
  );
}

export default Chatpage;
