import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCountryFlagImageUrl, getTeamAbbr, API_BASE } from "../utils/flagUtils";

const AllMatch = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const result = await fetch(`${API_BASE}/cricket`);
      const data = await result.json();
      setMatches(data.reverse()); // newest first
    } catch (error) {
      console.log("Failed to fetch matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMatch = async (id) => {
    try {
      await fetch(`${API_BASE}/cricket/${id}`, { method: "DELETE" });
      fetchMatches();
    } catch (error) {
      console.log("Failed to delete match:", error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-fade-in">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
        <div className="text-6xl">🏟️</div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-800">
            No Matches Yet
          </h2>
          <p className="text-slate-500 max-w-sm">
            Your match history is empty. Start a new match to see results here!
          </p>
        </div>
        <Link
          to="/"
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          🏏 Start a Match
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Match History
          </h1>
          <p className="text-slate-500 mt-1">
            {matches.length} match{matches.length !== 1 ? "es" : ""} played
          </p>
        </div>
        <Link
          to="/"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all text-sm"
        >
          + New Match
        </Link>
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-slate-100 overflow-hidden transition-all duration-300"
          >
            {/* Winner Banner (if match has result) */}
            {match.winner && (
              <div
                className={`px-6 py-2 text-center text-sm font-bold ${
                  match.winner === "Tie"
                    ? "bg-purple-50 text-purple-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {match.winner === "Tie"
                  ? `🤝 ${match.margin}`
                  : `🏆 ${match.winner} · ${match.margin}`}
              </div>
            )}

            {/* Match Body */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                {/* Team 1 */}
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={getCountryFlagImageUrl(match.teams[0])}
                    alt={match.teams[0]}
                    className="w-12 h-12 rounded-xl object-cover shadow"
                  />
                  <div>
                    <p
                      className={`font-bold ${
                        match.winner === match.teams[0]
                          ? "text-emerald-600"
                          : "text-slate-800"
                      }`}
                    >
                      {getTeamAbbr(match.teams[0])}
                      {match.winner === match.teams[0] && (
                        <span className="ml-1.5">✓</span>
                      )}
                    </p>
                    {match.innings1 && match.innings1.team === match.teams[0] && (
                      <p className="text-lg font-black text-slate-900">
                        {match.innings1.runs}/{match.innings1.wickets}
                        <span className="text-xs text-slate-400 ml-1 font-medium">
                          ({match.innings1.overs} ov)
                        </span>
                      </p>
                    )}
                    {match.innings2 && match.innings2.team === match.teams[0] && (
                      <p className="text-lg font-black text-slate-900">
                        {match.innings2.runs}/{match.innings2.wickets}
                        <span className="text-xs text-slate-400 ml-1 font-medium">
                          ({match.innings2.overs} ov)
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* VS */}
                <div className="px-4">
                  <span className="text-xl font-black text-slate-200">VS</span>
                </div>

                {/* Team 2 */}
                <div className="flex items-center gap-3 flex-1 justify-end text-right">
                  <div>
                    <p
                      className={`font-bold ${
                        match.winner === match.teams[1]
                          ? "text-emerald-600"
                          : "text-slate-800"
                      }`}
                    >
                      {match.winner === match.teams[1] && (
                        <span className="mr-1.5">✓</span>
                      )}
                      {getTeamAbbr(match.teams[1])}
                    </p>
                    {match.innings1 && match.innings1.team === match.teams[1] && (
                      <p className="text-lg font-black text-slate-900">
                        {match.innings1.runs}/{match.innings1.wickets}
                        <span className="text-xs text-slate-400 ml-1 font-medium">
                          ({match.innings1.overs} ov)
                        </span>
                      </p>
                    )}
                    {match.innings2 && match.innings2.team === match.teams[1] && (
                      <p className="text-lg font-black text-slate-900">
                        {match.innings2.runs}/{match.innings2.wickets}
                        <span className="text-xs text-slate-400 ml-1 font-medium">
                          ({match.innings2.overs} ov)
                        </span>
                      </p>
                    )}
                  </div>
                  <img
                    src={getCountryFlagImageUrl(match.teams[1])}
                    alt={match.teams[1]}
                    className="w-12 h-12 rounded-xl object-cover shadow"
                  />
                </div>
              </div>
            </div>

            {/* Delete Action */}
            <div className="border-t border-slate-100 px-5 py-3 flex justify-end">
              <button
                onClick={() => deleteMatch(match.id)}
                className="text-xs font-medium text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMatch;
