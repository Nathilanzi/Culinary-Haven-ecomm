"use client"; // Client component to handle client-side interactions

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()} 
      className="w-[40%] px-4 ml-[119px] block text-center bg-[#DB8C28] text-white font-semibold py-2 rounded-full shadow hover:bg-[#0C3B2E] transition-colors mt-[62px] dark:bg-teal-700"
    >
      Back
    </button>
  );
}