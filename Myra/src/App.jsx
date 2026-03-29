import React, { useContext } from "react";
import "./App.css";
import va from "./assets/ai.png";
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from "./context/UserContext";
import speakimg from "./assets/speak.gif"
import voiceimg from "./assets/voice.gif"

const App = () => {
  let { recognition, speaking, setSpeaking, prompt, response, setPrompt, setResponse  } = useContext(datacontext)
  
  return (
    <div className="main">
      <img src={va} alt="" id="Myra" />
      <span>I'm Myra, Your Virtual Assistant</span>
      {!speaking? <button onClick={()=>{
        setPrompt("listening...")
        setSpeaking(true)
        setResponse(false)
        recognition.start() }}>
        Click Here
        <CiMicrophoneOn />
      </button>
      : 
      <div className="response">
        {!response?
        <img src={speakimg} alt="" id="speak"/>:<img src={voiceimg} alt="" id="aigif"/>}
        
        <p>{prompt}</p>
        </div>}
    </div>
  );
};

export default App;
