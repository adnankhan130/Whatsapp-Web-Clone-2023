import React, { useEffect, useRef, useState } from 'react';
import "./Chatcontainer.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import ChatMessage from './ChatMessage';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import { useParams } from 'react-router-dom';
import { doc, addDoc, getDoc, onSnapshot, setDoc, Timestamp, query, orderBy, collection } from 'firebase/firestore';
import { db } from '../firebase';

const Chatcontainer = ({ currentUser }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [chatUser, setChatUser] = useState({});
  const { emailID } = useParams();
  const chatBox = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      const userDocRef = doc(db, 'users', emailID);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setChatUser(docSnap.data());
      }
    };

    const getMessages = () => {
      const messagesQuery = query(
        collection(db, 'chats', emailID, 'messages'),
        orderBy('timeStamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        const filteredMessages = messages.filter(
          (msg) =>
            (msg.senderEmail === currentUser.email || msg.senderEmail === emailID) ||
            (msg.receiverEmail === currentUser.email || msg.receiverEmail === emailID)
        );
        setChatMessages(filteredMessages);
      });

      return () => unsubscribe();
    };

    getUser();
    getMessages();
  }, [emailID, currentUser.email]);

  useEffect(() => {
    const handleMutation = () => {
      if (chatBox.current) {
        chatBox.current.scroll({ top: chatBox.current.scrollHeight, behavior: 'smooth' });
      }
    };

    const observer = new MutationObserver(handleMutation);

    if (chatBox.current) {
      observer.observe(chatBox.current, { childList: true });
    }

    return () => {
      if (chatBox.current) {
        observer.disconnect();
      }
    };
  }, [chatMessages]);

  const send = async (e) => {
    e.preventDefault();

    if (emailID) {
      let payload = {
        text: message,
        senderEmail: currentUser.email,
        receiverEmail: emailID,
        timeStamp: Timestamp.now(),
      };

      // sender
      await addDoc(collection(db, "chats", currentUser.email, "messages"), payload);

      // receiver
      await addDoc(collection(db, "chats", emailID, "messages"), payload);

      // Update Friendlist for sender
      await setDoc(
        doc(db, "Friendlist", currentUser.email, "list", emailID),
        {
          email: chatUser.email,
          fullname: chatUser.fullname,
          photoURL: chatUser.photoURL,
          lastMessage: message,
        }
      );

      // Update Friendlist for receiver
      await setDoc(
        doc(db, "Friendlist", emailID, "list", currentUser.email),
        {
          email: currentUser.email,
          fullname: currentUser.fullname,
          photoURL: currentUser.photoURL,
          lastMessage: message,
        }
      );

      setMessage("");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.toMillis());

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="chat-container">
      <div className="chat-container-header">
        <div className="chat-user-info">
          <div className="chat-user-img">
            <img src={chatUser?.photoURL} alt="" />
          </div>
          <p>{chatUser?.fullname}</p>
        </div>
        <div className="chat-container-header-btn">
          <MoreVertIcon />
        </div>
      </div>
      <div className='chat-display-container' ref={chatBox}>
        {chatMessages.map((msg) => (
          <ChatMessage
            key={msg.timeStamp.toMillis()}
            message={msg.text}
            date={formatTimestamp(msg.timeStamp)}
            time={formatTimestamp(msg.timeStamp)}
            sender={msg.senderEmail}
          />
        ))}
      </div>
      <div className='chat-input'>
        {openEmoji && <EmojiPicker
          onEmojiClick={(emojiObject) => setMessage((prevMessage) => prevMessage + emojiObject.emoji)}
        />}
        <div className='chat-input-btn'>
          <InsertEmoticonIcon onClick={() => setOpenEmoji(!openEmoji)} />
          <AttachFileIcon />
        </div>
        <form onSubmit={send}>
          <input
            type='text'
            placeholder='Type a Message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
        <div className='chat-input-send-btn' onClick={send}>
          <SendIcon />
        </div>
      </div>
    </div>
  );
}

export default Chatcontainer;
