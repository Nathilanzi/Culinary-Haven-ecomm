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
          className="group flex items-center gap-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Volume icon with hover effect */}
          <Volume2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="font-medium">
            {/* Dynamic button text based on loading state */}
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
                // Calculate progress width dynamically
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
            {/* Display current instruction text */}
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
                  className="p-2 text-gray-500 hover:text-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Volume1 className="w-5 h-5" />
                </button>
                {/* Display current speech rate */}
                <span className="font-medium text-gray-600 dark:text-gray-300 min-w-[4ch] text-center">
                  {speechRate.toFixed(1)}x
                </span>
                <button
                  onClick={() => handleSpeedChange(true)}
                  disabled={speechRate >= 2}
                  className="p-2 text-gray-500 hover:text-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Rewind className="w-6 h-6" />
                </button>
                {/* Play/Pause button */}
                <button
                  onClick={isPaused ? handleResume : handlePause}
                  className="p-3 rounded-full bg-teal-50 dark:bg-gray-700 hover:bg-teal-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {isPaused ? (
                    <Play className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <Pause className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  )}
                </button>
                {/* Next step button */}
                <button
                  onClick={handleNext}
                  disabled={currentStep === instructions.length - 1}
                  className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FastForward className="w-6 h-6" />
                </button>
              </div>
              {/* Stop button */}
              <button
                onClick={handleStop}
                className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <VolumeX className="w-5 h-5" />
                <span className="font-medium">Stop</span>
              </button>
            </div>
          </div>

          {/* Voice commands guide section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Voice Commands
            </h4>
            <div className="grid grid-cols-2 gap-6">
              {/* Voice command lists */}
              <div className="space-y-2">
                {[
                  '"Next step" / "Continue"',
                  '"Previous step" / "Back"',
                  '"Repeat" / "Again"',
                  '"Pause" / "Hold"',
                ].map((command, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <span className="w-1 h-1 bg-teal-400 rounded-full" />
                    {command}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  '"Resume" / "Play"',
                  '"Stop" / "Exit"',
                  '"Faster" / "Slower"',
                  '"Go to step [number]"',
                ].map((command, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <span className="w-1 h-1 bg-teal-400 rounded-full" />
                    {command}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step navigation buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {instructions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleJumpToStep(index)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentStep === index
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error toast notification */}
      {error && (
        <div className="fixed bottom-4 right-4 max-w-sm animate-slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-red-500 p-4">
            <div className="flex items-center justify-between">
              {/* Error message and close button */}
              <div className="flex items-center gap-3">
                <div className="text-red-500">
                  {/* Error icon */}
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
                {/* Error message text */}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {error}
                </p>
              </div>
              {/* Close error button */}
              <button
                onClick={() => setError(null)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
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
  );
};

export default ElegantVoiceAssistant;