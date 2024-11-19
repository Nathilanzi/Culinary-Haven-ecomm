"use client";
import { useState, useCallback } from "react";

export const useVoiceAssistant = (instructions) => {
  const [isReading, setIsReading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const cleanup = useCallback(() => {
    setIsReading(false);
    setIsPaused(false);
    setCurrentStep(0);
  }, []);

  const startReading = useCallback(() => {
    setIsReading(true);
  }, []);

  const handleNextStep = useCallback(() => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, instructions.length]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  return {
    isReading,
    isPaused,
    currentStep,
    startReading,
    handlePause,
    handleResume,
    handleNextStep,
    handlePreviousStep,
    cleanup,
  };
};
