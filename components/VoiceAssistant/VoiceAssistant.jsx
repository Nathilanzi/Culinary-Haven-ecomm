"use client";
import React, { useEffect } from "react";
import VoiceAssistantButton from "./VoiceAssistantButton";
import VoiceControls from "./VoiceControls";
import { useVoiceAssistant } from "./useVoiceAssistant";

const VoiceAssistant = ({ instructions }) => {
  const {
    isReading,
    isPaused,
    currentStep,
    startReading,
    handlePause,
    handleResume,
    handleNextStep,
    handlePreviousStep,
    cleanup,
  } = useVoiceAssistant(instructions);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  if (!instructions || instructions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {!isReading ? (
        <VoiceAssistantButton onClick={startReading} />
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {instructions.length}
          </div>

          <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
            {instructions[currentStep]}
          </div>

          <VoiceControls
            isPaused={isPaused}
            onPause={handlePause}
            onResume={handleResume}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            onStop={cleanup}
            currentStep={currentStep}
            totalSteps={instructions.length}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
