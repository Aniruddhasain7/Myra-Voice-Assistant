import React, { useContext } from "react";
import "./App.css";
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from "./context/UserContext";
import MyraAvatar from "./components/MyraAvatar";

const App = () => {
  let { recognition, speaking, prompt, response } = useContext(datacontext);

  const avatarState = !speaking ? "idle" : !response ? "listening" : "speaking";

  return (
    <div className="main">
      <div className="myra-section">
        <MyraAvatar state={avatarState} />
      </div>
      <span className="title-text">Myra</span>
      <button
        className={`mic-btn ${speaking && !response ? "listening" : ""}`}
        onClick={() => {
          recognition.start();
        }}
        title="Click to speak"
      >
        <CiMicrophoneOn />
      </button>

      {prompt && (
        <div className="response">
          <p className="prompt-display">{prompt}</p>
        </div>
      )}
    </div>
  );
};

export default App;
