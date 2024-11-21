"use client";

import { useState, useEffect } from "react";

/**
 * NumberOfStepsFilter component for filtering recipes by number of steps
 *
 * @component
 * @param {Object} props - Component properties
 * @param {URLSearchParams} props.searchParams - Current URL search parameters
 * @param {function} props.updateUrl - Function to update URL with new parameters
 *
 * @returns {React.ReactElement} Rendered number of steps filter input
 */
const NumberOfStepsFilter = ({ searchParams, updateUrl }) => {
  // State to manage the number of steps input
  const [numberOfSteps, setNumberOfSteps] = useState("");

  // Effect to sync input with URL parameters on initial load and parameter changes
  useEffect(() => {
    // Retrieve number of steps from URL or default to empty string
    const stepsFromUrl = searchParams.get("numberOfSteps") || "";
    setNumberOfSteps(stepsFromUrl);
  }, [searchParams]);

  /**
   * Handles changes to the number of steps input
   * Validates input to allow only numeric characters
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event
   */
  const handleNumberOfStepsChange = (event) => {
    // Destructure value from the input event
    const { value } = event.target;

    // Validate input to ensure only numeric characters are allowed
    const isValidInput = /^\d*$/.test(value);

    // Exit if input is invalid
    if (!isValidInput) return;

    // Update local state with the new value
    setNumberOfSteps(value);

    // Update URL parameters
    // Pass null if value is empty to remove the parameter
    updateUrl({ numberOfSteps: value || null });
  };

  return (
    <div className="relative w-full">
      {/* Label for accessibility and clarity */}
      <label
        htmlFor="numberOfSteps"
        className="block text-sm font-semibold text-gray-700 dark:text-gray-100 mb-2 select-none"
      >
        Number of Steps
      </label>

      {/* Number of Steps Input Field */}
      <input
        type="text"
        id="numberOfSteps"
        // Controlled input with value from state
        value={numberOfSteps}
        // Change handler for input validation and URL update
        onChange={handleNumberOfStepsChange}
        placeholder="Enter steps"
        className="flex items-center gap-3 px-14 py-2.5 
        w-full max-w-[300px]
        bg-white border border-gray-200 rounded-xl 
        hover:bg-gray-50 hover:shadow-md 
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-teal-500/50
        text-gray-800 font-medium"
      />
    </div>
  );
};

export default NumberOfStepsFilter;
