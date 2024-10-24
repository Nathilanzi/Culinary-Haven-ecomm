"use client"; // Client component to handle client-side interactions

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()} 
      className="w-[85%] px-4 mx-auto block text-center bg-[#DB8C28] text-white font-semibold py-2 rounded-full shadow hover:bg-[#0C3B2E] transition-colors mt-auto"
    >
      Back
    </button>
  );
}
