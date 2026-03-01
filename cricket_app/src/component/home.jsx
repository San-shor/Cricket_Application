import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCountryFlagImageUrl, TEAMS } from "../utils/flagUtils";

const Home = () => {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const navigate = useNavigate();

  const handleTeamSelect = (team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const handleStartMatch = () => {
    if (selectedTeams.length === 2) {
      navigate("/toss", { state: { teams: selectedTeams } });
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
          <span className="text-emerald-600">Cricket</span> Arena
        </h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          Pick two teams and battle it out in a thrilling 2-over match!
        </p>
        {selectedTeams.length === 0 && (
          <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
            <span>👆</span>
            <span>Tap on two flags to begin</span>
          </div>
        )}
      </div>

      {/* Team Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 max-w-4xl mx-auto">
        {TEAMS.map((team) => {
          const isSelected = selectedTeams.includes(team);
          const isDisabled = !isSelected && selectedTeams.length >= 2;

          return (
            <div
              key={team}
              onClick={() => !isDisabled && handleTeamSelect(team)}
              className={`
                relative group rounded-2xl overflow-hidden transition-all duration-300 transform
                ${
                  isSelected
                    ? "ring-4 ring-emerald-400 scale-105 shadow-xl shadow-emerald-100"
                    : isDisabled
                    ? "opacity-40 cursor-not-allowed grayscale"
                    : "cursor-pointer hover:scale-105 hover:shadow-xl shadow-md"
                }
              `}
            >
              {/* Flag Image */}
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={getCountryFlagImageUrl(team)}
                  alt={team}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Team Name */}
              <div
                className={`
                py-2.5 text-center font-semibold text-sm transition-colors duration-300
                ${
                  isSelected
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-slate-700 group-hover:bg-emerald-50"
                }
              `}
              >
                {team}
              </div>

              {/* Selection checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg animate-score-pop">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Teams Preview & Start Button */}
      {selectedTeams.length > 0 && (
        <div className="max-w-lg mx-auto animate-slide-up">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
            {/* VS Header */}
            <div className="flex items-center justify-center gap-6">
              {selectedTeams.map((team, i) => (
                <React.Fragment key={team}>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-2 ring-slate-100">
                      <img
                        src={getCountryFlagImageUrl(team)}
                        alt={team}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">
                      {team}
                    </span>
                  </div>
                  {i === 0 && selectedTeams.length === 2 && (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black text-amber-500">
                        VS
                      </span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Action */}
            {selectedTeams.length < 2 ? (
              <div className="flex items-center justify-center space-x-2 text-amber-600 bg-amber-50 rounded-full py-3 px-6">
                <span className="animate-pulse-slow text-xl">⚡</span>
                <span className="font-semibold">Select one more team</span>
              </div>
            ) : (
              <button
                onClick={handleStartMatch}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                🏏 Start Match
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
