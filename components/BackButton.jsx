"use client"; // Client component to handle client-side interactions

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()} 
      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
    >
      Back
    </button>
  );
}
