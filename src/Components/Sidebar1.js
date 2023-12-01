import React, { useEffect, useState } from 'react';
import TollIcon from '@mui/icons-material/Toll';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import UserProfile from './UserProfile';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Image1 from '../3177440.png';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar1 = ({ currentUser, signOut, formattedTime }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [friendList, setFriendList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const unsubscribeAllUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setAllUsers(
        snapshot.docs
          .filter((doc) => doc.data().email !== currentUser?.email)
          .map((doc) => doc.data())
      );
    });

    const unsubscribeFriendList = onSnapshot(
      collection(doc(db, 'Friendlist', currentUser.email), 'list'),
      (snapshot) => {
        setFriendList(snapshot.docs.map((doc) => doc.data()));
      }
    );

    return () => {
      unsubscribeAllUsers();
      unsubscribeFriendList();
    };
  }, [currentUser]);

  const searchedUser = allUsers.filter((user) => {
    if (searchInput) {
      if (user.fullname.toLowerCase().includes(searchInput.toLowerCase())) {
        return user;
      }
    }
  });

  const SearchItem = searchedUser.map((user) => (
    <UserProfile
      key={user.email}
      name={user.fullname}
      photoURL={user.photoURL}
      email={user.email}
      formattedTime={user.formattedTime}
    />
  ));

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };
  const handleHome = () => {
    navigate('/Home');
  };

  return (
    <div className='sidebar'>
      <div className='sidebar-header'>
        <div className='sidebar-header-img'>
          <img src={currentUser?.photoURL}  onClick={handleHome} alt='image' />
        </div>
        <div className='sidebar-header-btn'>
          <TollIcon />
          <InsertCommentIcon />
          <div className='dropdown-container'>
            <MoreVertIcon onClick={toggleDropdown} />
            {showDropdown && (
              <div className='dropdown-menu'>
                <div className='dropdown-item' onClick={() => console.log('Settings clicked')}>
                  Settings
                </div>
                <div className='dropdown-item' onClick={() => console.log('UserProfile clicked')}>
                  UserProfile
                </div>
                <div className='dropdown-item' onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='sidebar-search'>
        <div className='sidebar-search-input'>
          <SearchIcon />
          <input
            type='text'
            className='input'
            name='search'
            placeholder='Search.....'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>
      <div className='sidebar-chat-list'>
        {SearchItem.length > 0 ? (
          SearchItem
        ) : (
          friendList.map((friend) => (
            <UserProfile
              key={friend.email}
              name={friend.fullname}
              photoURL={friend.photoURL}
              lastMessage={friend.lastMessage}
              email={friend.email}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar1;
