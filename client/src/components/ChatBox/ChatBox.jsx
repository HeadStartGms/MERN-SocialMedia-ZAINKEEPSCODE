import React, { useEffect, useState, useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const scroll = useRef();
  const imageRef = useRef();

  // Fetch user data for the chat header
  useEffect(() => {
    const getUserData = async () => {
      if (chat) {
        const userId = chat.members.find((id) => id !== currentUser);
        try {
          const { data } = await getUser(userId);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    getUserData();
  }, [chat, currentUser]);

  // Fetch messages for the current chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (chat) {
        try {
          const { data } = await getMessages(chat._id);
          setMessages(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [chat]);

  // Automatically scroll to the latest message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle receiving a new message
  useEffect(() => {
    if (receivedMessage && receivedMessage.chatId === chat?._id) {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [receivedMessage, chat?._id]);

  // Handle sending a new message
  const handleSend = async (e) => {
    e.preventDefault();

    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    const receiverId = chat.members.find((id) => id !== currentUser);

    // Send message to the socket server
    setSendMessage({ ...message, receiverId });

    // Send message to the database
    try {
      const { data } = await addMessage(message);
      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="ChatBox-container">
      {chat ? (
        <>
          {/* Chat Header */}
          <div className="chat-header">
            <div className="follower">
              <div>
                <img
                  src={
                    userData?.profilePicture
                      ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture
                      : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"
                  }
                  alt="Profile"
                  className="followerImage"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="name" style={{ fontSize: "0.9rem" }}>
                  <span>
                    {userData?.firstname} {userData?.lastname}
                  </span>
                </div>
              </div>
            </div>
            <hr style={{ width: "95%", border: "0.1px solid #ececec", marginTop: "20px" }} />
          </div>

          {/* Chat Body */}
          <div className="chat-body">
            {messages.map((message, index) => (
              <div
                key={index}
                ref={scroll}
                className={message.senderId === currentUser ? "message own" : "message"}
              >
                <span>{message.text}</span>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
          </div>

          {/* Chat Sender */}
          <div className="chat-sender">
            <div onClick={() => imageRef.current.click()}>+</div>
            <InputEmoji value={newMessage} onChange={setNewMessage} />
            <div className="send-button button" onClick={handleSend}>
              Send
            </div>
            <input
              type="file"
              style={{ display: "none" }}
              ref={imageRef}
            />
          </div>
        </>
      ) : (
        <span className="chatbox-empty-message">Tap on a chat to start conversation...</span>
      )}
    </div>
  );
};

export default ChatBox;