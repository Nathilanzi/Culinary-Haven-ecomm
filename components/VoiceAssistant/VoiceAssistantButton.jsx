"use client";
import React from "react";
import { Volume2 } from "lucide-react";

const VoiceAssistantButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
    >
      <Volume2 className="w-5 h-5" />
      Read Instructions
    </button>
  );
};

export default VoiceAssistantButton;