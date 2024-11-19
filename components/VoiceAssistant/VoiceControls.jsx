"use client";
import React from "react";
import { FastForward, Rewind, Play, Pause, VolumeX } from "lucide-react";

const VoiceControls = ({
  isPaused,
  onPause,
  onResume,
  onPrevious,
  onNext,
  onStop,
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        <Rewind className="w-5 h-5" />
      </button>

      <button
        onClick={isPaused ? onResume : onPause}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {isPaused ? (
          <Play className="w-5 h-5" />
        ) : (
          <Pause className="w-5 h-5" />
        )}
      </button>

      <button
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        <FastForward className="w-5 h-5" />
      </button>

      <button
        onClick={onStop}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <VolumeX className="w-5 h-5" />
      </button>
    </div>
  );
};

export default VoiceControls;