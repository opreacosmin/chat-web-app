import './App.css';
import { io } from "socket.io-client";
import React,{useState, useEffect} from "react";


 let endPoint = "http://localhost:5000";
 let socket = io.connect(`${endPoint}`);

function App(){
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(["hello there stranger"]);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [user, setUser] = useState("");


  const handleClick = () => {
    if (buttonStatus === false && user !== "") {

      setButtonStatus(true);
    } else {
      alert("Please enter your username")
      setButtonStatus(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, [messages.length]);

  const getMessages = () => {
    socket.on("message",msg => {
      setMessages([...messages, msg]);
    })
  };

  const onSend = async (e) => {

    e.preventDefault();

    if(message !== ""){
      socket.emit("message", message);
      setMessage("");
    } else {
      alert("Please enter a message");
    }
  };

  return (
    <div className='app'>
        <div className='app-container'>
          {
            !buttonStatus ? (
                <div className='hero'>
                  <h1>Welcome to chat app</h1>
                  <input  className='input' type="text"
                          placeholder='username'
                          value={user}
                          onChange={ (e) => {
                                       setUser(e.target.value);} }/>
                  <button className='btn' onClick={handleClick}>Start chatting</button>
                </div>
            ) : (
                <>
                  <button className='btn-close' onClick={handleClick}>back</button>
                      <div className='chat-container'>
                        <ul className='messages-container'>
                            {messages.length > 0 && messages.map(msg => (
                                <li className='message'>
                                  {user+": "+msg}
                                </li>
                            ))}
                        </ul>
                        <form>
                          <input
                                   type='text'
                                   placeholder='message'
                                   value={message}
                                   onChange={(e)=> {
                                     setMessage(e.target.value);
                                   }}
                          />
                          <button type='submit'
                                    onClick={onSend}> Send
                          </button>
                        </form>
                      </div>
                </>
                  )
          }
        </div>
    </div>
  );
}

export default App;
