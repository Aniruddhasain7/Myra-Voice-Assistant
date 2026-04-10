import React, { createContext, useState } from "react";
import run from "../gemini";
export const datacontext = createContext();

const UserContext = ({ children }) => {
  let [speaking, setSpeaking] = useState(false);
  let [prompt, setPrompt] = useState("listening...");
  let [response, setResponse] = useState(false);

  function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.lang = "hi-GB";
    window.speechSynthesis.speak(text_speak);
  }
  async function aiResponse(prompt) {
    let text = await run(prompt);
    setPrompt(text);
    speak(text);
    setResponse(true);
    setTimeout(() => {
      setSpeaking(false);
    }, 7000);
  }
  let speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new speechRecognition();
  recognition.onresult = (e) => {
    let currentIndex = e.resultIndex;
    let transcript = e.results[currentIndex][0].transcript;
    setPrompt(transcript);
    takeCommand(transcript.toLowerCase());
  };
  function takeCommand(command) {
    if (command.includes("open youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("opening Youtube...");
      setResponse(true);
      setPrompt("opening Youtube...");
      setTimeout(() => {
        setSpeaking(false);
      }, 7000);
    } else if (command.includes("open google")) {
      window.open("https://www.google.com/", "_blank");
      speak("opening Google...");
      setResponse(true);
      setPrompt("opening Google...");
      setTimeout(() => {
        setSpeaking(false);
      }, 7000);
    } else if (command.includes("time")) {
      let time = new Date().toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
      });
      speak(time);
      setResponse(true);
      setPrompt(time);
      setTimeout(() => {
        setSpeaking(false);
      }, 7000);
    } else if (command.includes("date")) {
      let date = new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      speak(date);
      setResponse(true);
      setPrompt(date);
      setTimeout(() => {
        setSpeaking(false);
      }, 7000);
    } else if (command.includes("your name")) {
      speak("I am Myra, your virtual assistant");
      setResponse(true);
      setPrompt("I am Myra, your virtual assistant");
      setTimeout(() => {
        setSpeaking(false);
      }, 7000);
    } else if (command.includes("who created you")) {
      speak("I was created by Aniruddha");
      setResponse(true);
      setPrompt("I was created by Aniruddha");
      setTimeout(() => {
        setSpeaking(false);
      }, 7000);
    } else if (command.includes("open chatgpt")) {
      window.open("https://chatgpt.com/", "_blank");
      speak("opening Chatgpt...");
      setResponse(true);
      setPrompt("opening Chatgpt...");
      setTimeout(() => {
        setSpeaking(false);
      }, 7000);
    } else if (command.includes("open nexa")) {
      window.open("https://nexa-7.vercel.app/", "_blank");
      speak("opening Nexa...");
      setResponse(true);
      setPrompt("opening Nexa...");
      setTimeout(() => {
        setSpeaking(false);
      }, 7000);
    } else {
      aiResponse(command);
    }
  }

  let value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
  };
  return (
    <div>
      <datacontext.Provider value={value}>{children}</datacontext.Provider>
    </div>
  );
};

export default UserContext;
