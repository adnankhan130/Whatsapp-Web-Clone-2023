import React from 'react'
import Sidebar1 from './Sidebar1'
import "./Home.css"
const Home = ({currentUser,signOut}) => {
  return (
    <div className='home'>
      <div className='home-container'>
      <Sidebar1 currentUser={currentUser} signOut={signOut}/>
      <div className='home-bg'>
<img src='./WhatsAppbg.png' className='Image'></img>
      </div>
      </div>
    </div>
  
  )
}

export default Home