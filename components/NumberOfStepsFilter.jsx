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
    <div className="flex flex-col gap-1">
      <label
        htmlFor="numberOfSteps"
        className="text-sm font-medium text-gray-700 select-none"
      >
        Number of Steps
      </label>

      <input
        type="text"
        id="numberOfSteps"
        value={numberOfSteps}
        onChange={handleNumberOfStepsChange}
        placeholder="Enter steps"
        className="flex items-center gap-2 px-4 py-2.5 bg-white border 
                 border-gray-200 rounded-lg hover:bg-gray-50 
                 transition-all duration-200 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-gray-500 
                 focus:ring-opacity-50 text-gray-700"
      />
    </div>
  );
};

export default NumberOfStepsFilter;
