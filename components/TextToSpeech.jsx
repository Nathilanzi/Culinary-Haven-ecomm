"use client"
import { useState, useEffect } from "react";

const TextToSpeech = ({ instructions }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [synth, setSynth] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    if (isBrowser) {
      setSynth(window.speechSynthesis);
    }
  }, [isBrowser]);

  const playStep = (stepIndex) => {
    if (!synth || stepIndex >= instructions.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentStepIndex(0);
      setCurrentCharIndex(0);
      return;
    }

    const newUtterance = new SpeechSynthesisUtterance(instructions[stepIndex]);
    
    newUtterance.onboundary = (event) => {
      setCurrentCharIndex(event.charIndex);
    };

    newUtterance.onend = () => {
      if (stepIndex < instructions.length - 1) {
        setCurrentStepIndex(stepIndex + 1);
        setCurrentCharIndex(0);
        // Only continue to next step if not paused
        if (!isPaused) {
          playStep(stepIndex + 1);
        }
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentStepIndex(0);
        setCurrentCharIndex(0);
      }
    };

    newUtterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    synth.speak(newUtterance);
  };

  const handlePlayPause = () => {
    if (!synth) return;

    if (!isPlaying) {
      if (isPaused) {
        // Resume from paused state
        synth.resume();
        setIsPlaying(true);
        setIsPaused(false);
      } else {
        // Start from beginning or current step
        synth.cancel();
        setIsPlaying(true);
        setIsPaused(false);
        playStep(currentStepIndex);
      }
    } else {
      // Pause playback
      synth.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (synth) {
      synth.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentStepIndex(0);
      setCurrentCharIndex(0);
    }
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);

  return (
    <div className="mt-4">
      <button
        onClick={handlePlayPause}
        className="mb-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
      >
        {isPlaying ? "Pause Instructions" : isPaused ? "Resume Instructions" : "Read Instructions"}
      </button>

      {(isPlaying || isPaused || currentStepIndex > 0 || currentCharIndex > 0) && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className={`p-2 rounded-full ${
                isPlaying
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-teal-500 text-white hover:bg-teal-600"
              } transition-all`}
            >
              {isPlaying ? "Pause" : isPaused ? "Resume" : "Play"}
            </button>
            <button
              onClick={handleStop}
              className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Stop
            </button>
          </div>
          
          <div className="text-gray-700 dark:text-gray-300">
            <div className="font-medium mb-2">
              Step {currentStepIndex + 1} of {instructions.length}
            </div>
            <div>
              <strong>{instructions[currentStepIndex]?.slice(0, currentCharIndex)}</strong>
              <span className="text-gray-400">
                {instructions[currentStepIndex]?.slice(currentCharIndex)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;