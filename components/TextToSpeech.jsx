"use client";

import React, { useEffect } from "react";
import { useVoiceAssistant } from "./VoiceAssistant/useVoiceAssistant";
import ElegantVoiceAssistant from "./VoiceAssistant/ElegantVoiceAssistant";

/**
 * TextToSpeech component for reading and controlling step-by-step instructions via voice
 * @param {Object} props - Component properties
 * @param {Array} props.instructions - Array of instructions to be read aloud
 * @returns {React.ReactElement|null} Rendered voice assistant component or null
 */
const TextToSpeech = ({ instructions }) => {
  // Destructure all states and methods from custom voice assistant hook
  const {
    isReading, // Whether instructions are currently being read
    isPaused, // Whether reading is paused
    currentStep, // Current step in the instructions
    speechRate, // Speed of speech playback
    error, // Any error that occurred during voice playback
    isInitializing, // Whether voice assistant is initializing
    isListening, // Whether the assistant is listening for commands
    startReading, // Method to start reading instructions
    handlePause, // Method to pause reading
    handleResume, // Method to resume reading
    handleNextStep, // Method to move to next instruction step
    handlePreviousStep, // Method to move to previous instruction step
    handleJumpToStep, // Method to jump to a specific instruction step
    adjustSpeed, // Method to adjust speech playback speed
    cleanup, // Method to stop and reset voice assistant
    setError, // Method to set error state
  } = useVoiceAssistant(instructions);

  // Clean up voice assistant resources when component unmounts
  useEffect(() => {
    return () => cleanup(); // Call cleanup function on component unmount
  }, [cleanup]);

  // Render nothing if no instructions are provided
  if (!instructions || instructions.length === 0) {
    return null;
  }

  // Render the elegant voice assistant UI with all necessary props and handlers
  return (
    <ElegantVoiceAssistant
      instructions={instructions}
      showInstructions={isReading}
      currentStep={currentStep}
      isPaused={isPaused}
      isListening={isListening}
      speechRate={speechRate}
      error={error}
      handleStart={startReading}
      handlePrevious={handlePreviousStep}
      handleNext={handleNextStep}
      handlePause={handlePause}
      handleResume={handleResume}
      handleStop={cleanup}
      handleSpeedChange={adjustSpeed}
      handleJumpToStep={handleJumpToStep}
      setError={setError}
      isLoading={isInitializing}
    />
  );
};

export default TextToSpeech; // Export the TextToSpeech component as default
