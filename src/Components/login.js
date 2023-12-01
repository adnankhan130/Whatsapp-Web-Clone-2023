import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db } from '../firebase'; // assuming db is exported from your firebase.js file
import { doc, setDoc } from 'firebase/firestore';
import './Login.css';
import Google from "../google.png"
import Wt from "../whatsapp-logo.png"
const Login =({ setUser }) =>{
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const authInstance = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(authInstance, provider);

      const newUser = {
        fullname: userCredential.user.displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
      };

      navigate('/Home');
      setUser(newUser);


      const userDocRef = doc(db, 'users', userCredential.user.email);
      await setDoc(userDocRef, newUser);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <img className="login-logo" src= {Wt}alt="" />
        <p className="login-name">WhatsApp Web</p>
        <button className="login-btn" onClick={handleGoogleLogin}>
          <img src={Google} alt="login with google" />
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
