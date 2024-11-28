"use client";

import React from "react";
import {
  Volume2,
  Volume1,
  Mic,
  Rewind,
  Play,
  Pause,
  FastForward,
  VolumeX,
} from "lucide-react";

/**
 * ElegantVoiceAssistant - A comprehensive voice instruction interface
 * @component
 * @param {Object} props - Component properties
 * @param {string[]} props.instructions - Array of instruction steps
 * @param {boolean} props.showInstructions - Flag to show/hide instructions
 * @param {number} props.currentStep - Current step index
 * @param {boolean} props.isPaused - Indicates if playback is paused
 * @param {boolean} props.isListening - Indicates if voice recognition is active
 * @param {number} props.speechRate - Current speech playback rate
 * @param {string} [props.error] - Error message to display
 * @param {Function} props.handleStart - Start button click handler
 * @param {Function} props.handlePrevious - Previous step handler
 * @param {Function} props.handleNext - Next step handler
 * @param {Function} props.handlePause - Pause playback handler
 * @param {Function} props.handleResume - Resume playback handler
 * @param {Function} props.handleStop - Stop playback handler
 * @param {Function} props.handleSpeedChange - Change speech rate handler
 * @param {Function} props.handleJumpToStep - Jump to specific step handler
 * @param {Function} props.setError - Set error message handler
 * @param {boolean} props.isLoading - Indicates if component is loading
 * @returns {React.ReactElement} Rendered voice assistant interface
 */
const ElegantVoiceAssistant = ({
  instructions,
  showInstructions,
  currentStep,
  isPaused,
  isListening,
  speechRate,
  error,
  handleStart,
  handlePrevious,
  handleNext,
  handlePause,
  handleResume,
  handleStop,
  handleSpeedChange,
  handleJumpToStep,
  setError,
  isLoading,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      {/* Initial start button when instructions are not shown */}
      {!showInstructions ? (
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="flex items-center gap-3 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
        >
          <Volume2 className="w-6 h-6" />
          <span className="font-medium">
            {isLoading ? "Initializing..." : "Start Voice Instructions"}
          </span>
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6">
          {/* Progress bar showing current step progress */}
          <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-500 ease-in-out"
              style={{
                width: `${((currentStep + 1) / instructions.length) * 100}%`,
              }}
            />
          </div>

          {/* Current step display with step number and instruction text */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.01]">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
              <span className="text-teal-500">Step {currentStep + 1}</span>
              <span className="text-sm text-gray-400">
                of {instructions.length}
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {instructions[currentStep]}
            </p>
          </div>

          {/* Controls section with speed and playback controls */}
          <div className="space-y-6">
            {/* Speed and listening status controls */}
            <div className="flex items-center justify-between px-2">
              {/* Speech rate adjustment buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleSpeedChange(false)}
                  disabled={speechRate <= 0.5}
                  className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
                >
                  <Volume1 className="w-5 h-5" />
                </button>
                <span className="font-medium text-gray-600 dark:text-gray-300 min-w-[4ch] text-center">
                  {speechRate.toFixed(1)}x
                </span>
                <button
                  onClick={() => handleSpeedChange(true)}
                  disabled={speechRate >= 2}
                  className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              {/* Listening status indicator */}
              <div
                className={`flex items-center gap-3 ${
                  isListening ? "text-teal-500" : "text-gray-400"
                } transition-colors duration-300`}
              >
                <Mic className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {isListening ? "Listening..." : "Voice Ready"}
                </span>
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-between">
              {/* Navigation and play/pause buttons */}
              <div className="flex items-center gap-4">
                {/* Previous step button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
                >
                  <Rewind className="w-6 h-6" />
                </button>
                {/* Play/Pause button */}
                <button
                  onClick={isPaused ? handleResume : handlePause}
                  className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
                >
                  {isPaused ? (
                    <Play className="w-6 h-6" />
                  ) : (
                    <Pause className="w-6 h-6" />
                  )}
                </button>
                {/* Next step button */}
                <button
                  onClick={handleNext}
                  disabled={currentStep === instructions.length - 1}
                  className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
                >
                  <FastForward className="w-6 h-6" />
                </button>
              </div>
              {/* Stop button */}
              <button
                onClick={handleStop}
                className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                <VolumeX className="w-5 h-5 mr-2" />
                <span className="font-medium">Stop</span>
              </button>
            </div>
          </div>

          {/* Step navigation buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {instructions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleJumpToStep(index)}
                className={`flex items-center justify-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700 ${
                  currentStep === index ? "bg-teal-700 dark:bg-teal-800" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Existing error handling section remains the same */}
          {error && (
            <div className="fixed bottom-4 right-4 max-w-sm animate-slide-up">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-red-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-red-500">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ElegantVoiceAssistant;
