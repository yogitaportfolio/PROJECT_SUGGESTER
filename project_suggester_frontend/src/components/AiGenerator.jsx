import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { apiFetch } from "../api";

export default function AiGenerator({ projects = [], onSuggestionAdded }) {
  const [prompt, setPrompt] = useState("");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await apiFetch("/ai/generate", {
        method: "POST",
        body: JSON.stringify({ prompt, projectId }),
      });
      setResult(res.result);
      if (projectId && onSuggestionAdded) onSuggestionAdded();
    } catch (e) {
      setErr(e.message || JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8 max-w-4xl mx-auto mb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-500" size={22} />
          <h2 className="text-lg font-semibold text-gray-900">
            AI Project Idea Generator
          </h2>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="space-y-4">
        <textarea
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-gray-400"
          rows={5}
          placeholder="Ask for project ideas, features, or tech stack suggestions..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <select
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">Don't save (one-off)</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 px-5 py-3 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Generating..." : "Generate Ideas"}
        </button>
      </form>

      {/* Result or Error */}
      {err && (
        <p className="mt-4 text-red-500 text-sm font-medium bg-red-50 border border-red-200 p-3 rounded-lg">
          {err}
        </p>
      )}

      {result && (
        <div className="mt-6 bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm text-gray-800 whitespace-pre-wrap leading-relaxed hover:shadow-md transition">
          {result}
        </div>
      )}
    </section>
  );
}
