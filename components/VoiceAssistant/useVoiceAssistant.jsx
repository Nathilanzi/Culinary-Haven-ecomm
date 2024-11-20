"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for creating a voice-enabled instruction assistant
 * @param {string[]} instructions - Array of instruction steps to be read
 * @returns {Object} Voice assistant control and state methods
 */
export const useVoiceAssistant = (instructions) => {
  // State variables for managing voice assistant functionality
  const [isReading, setIsReading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isListening, setIsListening] = useState(false);

  // Refs for managing speech synthesis and recognition APIs
  const speechSynthesisRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const utterancesRef = useRef([]);

  /**
   * Initialize voice synthesis and recognition features
   * @private
   */
  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined") {
        try {
          // Initialize speech synthesis
          speechSynthesisRef.current = window.speechSynthesis;
          
          // Create utterances for each instruction
          utterancesRef.current = instructions.map((instruction, index) => {
            const utterance = new SpeechSynthesisUtterance(
              `Step ${index + 1}: ${instruction}`
            );
            utterance.rate = speechRate;
            return utterance;
          });

          // Initialize speech recognition if supported
          if ("webkitSpeechRecognition" in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = "en-US";
            recognitionRef.current.maxAlternatives = 3;

            // Set up recognition event handlers
            recognitionRef.current.onstart = () => {
              setIsListening(true);
            };

            recognitionRef.current.onend = () => {
              setIsListening(false);
            };

            // Process voice recognition results
            recognitionRef.current.onresult = (event) => {
              const results = event.results[event.results.length - 1];
              for (let i = 0; i < results.length; i++) {
                const command = results[i].transcript.toLowerCase().trim();
                if (handleVoiceCommand(command)) break;
              }
            };

            // Handle recognition errors
            recognitionRef.current.onerror = (event) => {
              if (
                event.error === "not-allowed" ||
                event.error === "service-not-allowed"
              ) {
                setError("Speech to text feature failed");
              }
            };
          }
        } catch (error) {
          setError("Failed to initialize voice features");
        } finally {
          setIsInitializing(false);
        }
      }
    };

    init();
    return () => cleanup();
  }, [instructions]);

  /**
   * Clean up voice assistant resources
   * @returns {void}
   */
  const cleanup = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsReading(false);
    setIsPaused(false);
    setCurrentStep(0);
    setError(null);
    setIsListening(false);
  }, []);

  /**
   * Handle voice commands for navigation and control
   * @param {string} command - Recognized voice command
   * @returns {boolean} Whether a command was successfully processed
   */
  const handleVoiceCommand = useCallback(
    (command) => {
      // Regex patterns for different voice commands
      const commandPatterns = {
        next: /^(next|forward|skip|continue|proceed)( step)?$/,
        previous: /^(previous|back|go back|return)( step)?$/,
        repeat: /^(repeat|again|say again)( step)?$/,
        pause: /^(pause|wait|hold|stop temporarily)$/,
        resume: /^(resume|continue|start again|begin|play)$/,
        stop: /^(stop|exit|quit|end)$/,
        goToStep: /^(go to|jump to|skip to) step (\d+)$/,
        slower: /^(slower|reduce speed|slow down)$/,
        faster: /^(faster|increase speed|speed up)$/,
      };

      // Command handlers with corresponding regex tests
      if (commandPatterns.next.test(command)) {
        handleNextStep();
        return true;
      }
      if (commandPatterns.previous.test(command)) {
        handlePreviousStep();
        return true;
      }
      if (commandPatterns.repeat.test(command)) {
        readStep(currentStep);
        return true;
      }
      if (commandPatterns.pause.test(command)) {
        handlePause();
        return true;
      }
      if (commandPatterns.resume.test(command)) {
        handleResume();
        return true;
      }
      if (commandPatterns.stop.test(command)) {
        cleanup();
        return true;
      }
      if (commandPatterns.slower.test(command)) {
        adjustSpeed(false);
        return true;
      }
      if (commandPatterns.faster.test(command)) {
        adjustSpeed(true);
        return true;
      }

      // Handle "go to step" command
      const goToStepMatch = command.match(commandPatterns.goToStep);
      if (goToStepMatch) {
        const stepNumber = parseInt(goToStepMatch[2]) - 1;
        if (stepNumber >= 0 && stepNumber < instructions.length) {
          handleJumpToStep(stepNumber);
          return true;
        }
      }
      return false;
    },
    [currentStep, instructions]
  );

  /**
   * Read a specific instruction step
   * @param {number} stepIndex - Index of the step to read
   */
  const readStep = useCallback(
    (stepIndex) => {
      try {
        if (speechSynthesisRef.current) {
          speechSynthesisRef.current.cancel();
          const utterance = utterancesRef.current[stepIndex];
          utterance.rate = speechRate;
          utterance.onend = () => {
            if (stepIndex < instructions.length - 1 && !isPaused) {
              setCurrentStep(stepIndex + 1);
              readStep(stepIndex + 1);
            }
          };
          utterance.onerror = () => {
            setError("Text to speech feature failed");
          };
          utteranceRef.current = utterance;
          speechSynthesisRef.current.speak(utterance);
        }
      } catch (error) {
        setError("Text to speech feature failed");
      }
    },
    [instructions.length, speechRate, isPaused]
  );

  /**
   * Jump to a specific instruction step
   * @param {number} stepIndex - Index of the step to jump to
   */
  const handleJumpToStep = useCallback((stepIndex) => {
    setCurrentStep(stepIndex);
    readStep(stepIndex);
  }, [readStep]);

  /**
   * Start reading instructions
   */
  const startReading = useCallback(() => {
    try {
      setIsReading(true);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      readStep(currentStep);
    } catch (error) {
      setError("Failed to start reading");
    }
  }, [currentStep, readStep]);

  /**
   * Move to the next instruction step
   */
  const handleNextStep = useCallback(() => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      readStep(currentStep + 1);
    }
  }, [currentStep, instructions.length, readStep]);

  /**
   * Move to the previous instruction step
   */
  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      readStep(currentStep - 1);
    }
  }, [currentStep, readStep]);

  /**
   * Pause speech synthesis
   */
  const handlePause = useCallback(() => {
    if (speechSynthesisRef.current) {
      setIsPaused(true);
      speechSynthesisRef.current.pause();
    }
  }, []);

  /**
   * Resume speech synthesis
   */
  const handleResume = useCallback(() => {
    if (speechSynthesisRef.current) {
      setIsPaused(false);
      speechSynthesisRef.current.resume();
    }
  }, []);

  /**
   * Adjust speech rate
   * @param {boolean} faster - Whether to increase or decrease speed
   */
  const adjustSpeed = useCallback((faster) => {
    setSpeechRate((prev) => {
      const newRate = faster ? Math.min(prev + 0.25, 2) : Math.max(prev - 0.25, 0.5);
      if (utteranceRef.current) {
        utteranceRef.current.rate = newRate;
      }
      return newRate;
    });
  }, []);

  // Return hook methods and state for component use
  return {
    isReading,
    isPaused,
    currentStep,
    speechRate,
    error,
    isInitializing,
    isListening,
    startReading,
    handlePause,
    handleResume,
    handleNextStep,
    handlePreviousStep,
    handleJumpToStep,
    adjustSpeed,
    cleanup,
    setError,
  };
};