import React, { useEffect } from "react";

const VoiceAlert = () => {
  useEffect(() => {
    const startListening = async () => {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.continuous = true;

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (transcript.includes("help") || transcript.includes("danger")) {
          alert("Emergency detected! Sending alert...");
          fetch("http://localhost:8000/api/send-alert/");
        }
      };

      recognition.start();
    };

    startListening();
  }, []);

  return <div><h2>Voice Detection Active...</h2></div>;
};

export default VoiceAlert;