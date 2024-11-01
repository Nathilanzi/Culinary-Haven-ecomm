"use client";

import { useState, useEffect } from "react";

const NumberOfStepsFilter = ({ searchParams, updateUrl }) => {
  const [numberOfSteps, setNumberOfSteps] = useState("");

  useEffect(() => {
    const stepsFromUrl = searchParams.get("numberOfSteps") || "";
    setNumberOfSteps(stepsFromUrl);
  }, [searchParams]);

  const handleNumberOfStepsChange = (event) => {
    const { value } = event.target;
    const isValidInput = /^\d*$/.test(value);

    if (!isValidInput) return;

    setNumberOfSteps(value);
    updateUrl({ numberOfSteps: value || null });
  };

  return (
    <div className="relative flex items-center gap-4">
      <label
        htmlFor="numberOfSteps"
        className="text-sm font-medium text-gray-700 select-none whitespace-nowrap"
      >
        Number of Steps
      </label>
      
      <input
        type="text"
        id="numberOfSteps"
        value={numberOfSteps}
        onChange={handleNumberOfStepsChange}
        placeholder="Enter steps"
        className="w-24 h-9 px-3 py-2
                 bg-white/50 
                 border border-gray-200 rounded-lg
                 text-sm text-gray-900
                 placeholder:text-gray-400
                 hover:border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400
                 transition-colors duration-200"
      />
    </div>
  );
};

export default NumberOfStepsFilter;