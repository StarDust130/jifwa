"use client";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-lg">Something cool is on the way!</p>
      </div>
    </div>
  );
};
export default page;
