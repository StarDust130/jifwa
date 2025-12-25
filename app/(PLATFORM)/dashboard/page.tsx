"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the shape of our data (TypeScript interface)
interface Milestone {
  title: string;
  due_date: string;
  criteria: string;
}

interface ContractData {
  summary: string;
  parties: string[];
  total_value: string;
  milestones: Milestone[];
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ContractData | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Something went wrong");
      }

      setData(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-2">🚀 New Project Execution</h1>
      <p className="text-gray-500 mb-8">
        Upload a contract to generate milestones instantly.
      </p>

      {/* --- UPLOAD SECTION --- */}
      <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
          "
        />

        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-4 px-6 py-2 rounded-lg text-white font-medium transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Analyzing Contract (5s)..." : "Generate Milestones"}
          </button>
        )}
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          ❌ {error}
        </div>
      )}

      {/* --- RESULTS DASHBOARD --- */}
      {data && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* HEADER CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                Total Value
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.total_value}
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
              <h3 className="text-xs font-bold text-purple-500 uppercase tracking-wider">
                Parties Involved
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.parties.map((party, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white rounded border border-purple-200 text-xs font-medium text-purple-700"
                  >
                    {party}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">📝 Executive Summary</h3>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border">
              {data.summary}
            </p>
          </div>

          {/* MILESTONES TIMELINE */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              📍 Execution Timeline
            </h3>
            <div className="space-y-4">
              {data.milestones.map((milestone, i) => (
                <div
                  key={i}
                  className="group relative pl-8 border-l-2 border-gray-200 hover:border-blue-500 transition-colors pb-6 last:pb-0"
                >
                  {/* Dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-gray-300 rounded-full group-hover:border-blue-500 group-hover:scale-110 transition-all"></div>

                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900">
                      {milestone.title}
                    </h4>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                      Due: {milestone.due_date}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1 italic">
                    "Acceptance Criteria: {milestone.criteria}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
