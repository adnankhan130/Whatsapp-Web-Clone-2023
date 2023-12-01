import React from 'react'
import "./UserProfile.css"
import Image1 from "../3177440.png";
import { useNavigate } from 'react-router-dom';

const UserProfile = ({name,photoURL,email,lastMessage}) => {
  const navigate = useNavigate();
  const goToUser =(emailId)=>{
    if (emailId){
      navigate(`/${emailId}`);
    }
  }
  return (
    <div className='user-profile' onClick={()=> goToUser(email)}>
    <div className='user-image'>
    <img src={photoURL} alt='image'></img>
    </div>
    <div className='user-info'>
<p className='user-name'>{name}</p>
{lastMessage && ( <p className='user-lastmessage'>{lastMessage}</p>)}
    </div>
    </div>
  )
}

export default UserProfile