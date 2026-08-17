import React, { createContext, useState, useRef, useEffect } from "react";
import run from "../gemini";

export const datacontext = createContext();

function cleanMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/```[a-z]*\n([\s\S]*?)\n```/g, "$1")
    .replace(/#+\s+(.*)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s*[\-\*+]\s+/gm, "")
    .trim();
}

const UserContext = ({ children }) => {
  let [speaking, setSpeaking] = useState(false);
  let [prompt, setPrompt] = useState("");
  let [response, setResponse] = useState(false);
  let [voiceList, setVoiceList] = useState([]);

  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const available = window.speechSynthesis.getVoices();
        if (available.length > 0) {
          setVoiceList(available);
        }
      }
    };

    updateVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  if (!recognitionRef.current && typeof window !== "undefined") {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = navigator.language || "en-IN";
      recognitionRef.current = rec;
    }
  }

  function speak(text) {
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    window.speechSynthesis.cancel();

    let cleanText = cleanMarkdown(text)
      .replace(/\n+/g, " ")
      .replace(/[*#_`~[\]{}()|\\<>]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      setSpeaking(false);
      return;
    }

    let text_speak = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = text_speak;
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;

    const currentVoices =
      voiceList.length > 0
        ? voiceList
        : typeof window !== "undefined" && window.speechSynthesis
          ? window.speechSynthesis.getVoices()
          : [];

    const femaleVoice = currentVoices.find(
      (v) => v.lang === "hi-GB" || v.name.includes("Google US English"),
    );

    if (femaleVoice) {
      text_speak.voice = femaleVoice;
      text_speak.lang = femaleVoice.lang;
    } else {
      text_speak.lang = "hi-GB";
    }

    console.log(
      "Currently speaking voice:",
      text_speak.voice
        ? `${text_speak.voice.name} (${text_speak.voice.lang})`
        : `Browser Default (${text_speak.lang})`,
    );

    const fallbackDuration = Math.max(10000, cleanText.length * 150);
    timeoutRef.current = setTimeout(() => {
      setSpeaking(false);
    }, fallbackDuration);

    text_speak.onend = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setSpeaking(false);
    };

    text_speak.onerror = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setSpeaking(false);
    };

    window.speechSynthesis.speak(text_speak);
  }

  async function aiResponse(promptText) {
    let text = await run(promptText);
    let cleanedText = cleanMarkdown(text);
    setPrompt(cleanedText);
    speak(cleanedText);
    setResponse(true);
  }

  function takeCommand(command) {
    if (command.includes("open youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("opening Youtube...");
      setResponse(true);
      setPrompt("opening Youtube...");
    } else if (command.includes("open google")) {
      window.open("https://www.google.com/", "_blank");
      speak("opening Google...");
      setResponse(true);
      setPrompt("opening Google...");
    } else if (command.includes("time")) {
      let time = new Date().toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
      });
      speak(time);
      setResponse(true);
      setPrompt(time);
    } else if (command.includes("date")) {
      let date = new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      speak(date);
      setResponse(true);
      setPrompt(date);
    } else if (command.includes("your name")) {
      speak("I am Myra, your virtual assistant");
      setResponse(true);
      setPrompt("I am Myra, your virtual assistant");
    } else if (command.includes("who created you")) {
      speak("I was created by Aniruddha");
      setResponse(true);
      setPrompt("I was created by Aniruddha");
    } else if (command.includes("open nexa")) {
      window.open("https://nexa-7.vercel.app/", "_blank");
      speak("opening Nexa...");
      setResponse(true);
      setPrompt("opening Nexa...");
    } else {
      aiResponse(command);
    }
  }

  useEffect(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    rec.onstart = () => {
      setSpeaking(true);
      setResponse(false);
      setPrompt("Listening...");
    };

    rec.onresult = (e) => {
      let currentIndex = e.resultIndex;
      let transcript = e.results[currentIndex][0].transcript;
      setPrompt(transcript);
      takeCommand(transcript.toLowerCase());
    };

    rec.onerror = (e) => {
      console.error("Speech Recognition Error:", e.error);
      if (e.error === "no-speech") {
        setPrompt("No speech detected. Click the mic to try again.");
      } else if (e.error === "not-allowed") {
        setPrompt(
          "Microphone access blocked. Please allow mic in browser settings.",
        );
      } else {
        setPrompt("Could not hear clearly. Click mic to try again.");
      }
      setSpeaking(false);
    };

    rec.onend = () => {};
  }, []);

  const recognition = {
    start: () => {
      if (!recognitionRef.current) {
        alert(
          "Speech recognition is not supported in this browser. Please use Google Chrome or Edge.",
        );
        return;
      }
      try {
        recognitionRef.current.lang = navigator.language || "en-IN";
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Recognition already active or failed to start:", err);
      }
    },
    stop: () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {}
      }
    },
  };

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
