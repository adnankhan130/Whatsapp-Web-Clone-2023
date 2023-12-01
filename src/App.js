import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/login';
import { doc, addDoc, getDoc, onSnapshot, setDoc, Timestamp, query, orderBy, collection } from 'firebase/firestore';
import Chatpage from './Components/Chatpage';
import Home from './Components/Home';
import { auth } from './firebase';
import { db } from './firebase';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        localStorage.setItem('user', JSON.stringify(authUser));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {})
      .catch((error) => alert(error.message));
  };

  const createChat = async (currentUserEmail, otherUserEmail) => {
    await setDoc(doc(db, 'chats', currentUserEmail, 'messages', otherUserEmail), { messages: [] });
    await setDoc(doc(db, 'chats', otherUserEmail, 'messages', currentUserEmail), { messages: [] });
  };

  return (
    <Router>
      <div className='App'>
        <Routes>
          {user ? (
            <>
              <Route
                path='/:emailID'
                element={<Chatpage currentUser={user} signOut={signOut} createChat={createChat} />}
              />
              <Route path='Home' element={<Home currentUser={user} signOut={signOut} createChat={createChat} />} />
            </>
          ) : (
            <>
              <Route path='/' element={<Login setUser={setUser} />} />
             
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
