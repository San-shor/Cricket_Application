import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { getCountryFlagImageUrl } from "../utils/flagUtils";

const Toss = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const teams = location.state?.teams;

  const [isFlipping, setIsFlipping] = useState(false);
  const [tossWinner, setTossWinner] = useState(null);
  const [tossDecision, setTossDecision] = useState(null);

  // Redirect if no teams were passed
  if (!teams || teams.length < 2) {
    return <Navigate to="/" replace />;
  }

  const handleToss = () => {
    setIsFlipping(true);
    setTossWinner(null);
    setTossDecision(null);

    setTimeout(() => {
      const winner = teams[Math.floor(Math.random() * 2)];
      setTossWinner(winner);
      setIsFlipping(false);
    }, 2000);
  };

  const handleDecision = (decision) => {
    setTossDecision(decision);

    const battingFirst =
      decision === "bat" ? tossWinner : teams.find((t) => t !== tossWinner);
    const bowlingFirst =
      decision === "bowl" ? tossWinner : teams.find((t) => t !== tossWinner);

    setTimeout(() => {
      navigate("/play", {
        state: {
          teams,
          tossWinner,
          tossDecision: decision,
          battingFirst,
          bowlingFirst,
        },
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
          🪙 The Toss
        </h1>
        <p className="text-slate-500 text-lg">
          {teams[0]} vs {teams[1]}
        </p>
      </div>

      {/* Teams Face-off */}
      <div className="flex items-center justify-center gap-6 sm:gap-10">
        {teams.map((team, i) => (
          <React.Fragment key={team}>
            <div className="flex flex-col items-center space-y-3">
              <div
                className={`
                  w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg 
                  transition-all duration-700 ease-out
                  ${
                    tossWinner === team
                      ? "ring-4 ring-amber-400 scale-110 shadow-amber-200 shadow-xl"
                      : ""
                  }
                  ${
                    tossWinner && tossWinner !== team
                      ? "opacity-40 scale-90 grayscale"
                      : ""
                  }
                `}
              >
                <img
                  src={getCountryFlagImageUrl(team)}
                  alt={team}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`font-bold text-sm sm:text-base transition-colors duration-500 ${
                  tossWinner === team
                    ? "text-amber-600"
                    : tossWinner
                    ? "text-slate-400"
                    : "text-slate-700"
                }`}
              >
                {team}
              </span>
              {tossWinner === team && (
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full animate-score-pop">
                  WON THE TOSS
                </span>
              )}
            </div>
            {i === 0 && (
              <span className="text-3xl font-black text-slate-200">VS</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Coin & Flip Button */}
      {!tossWinner && (
        <div className="flex flex-col items-center space-y-6">
          <div className={`coin ${isFlipping ? "coin-flipping" : ""}`}>
            <div className="coin-inner">
              <span className="text-5xl select-none">
                {isFlipping ? "🪙" : "🏏"}
              </span>
            </div>
          </div>
          <button
            onClick={handleToss}
            disabled={isFlipping}
            className={`
              px-10 py-3 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300
              ${
                isFlipping
                  ? "bg-slate-300 text-slate-500 cursor-wait"
                  : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white hover:scale-105 hover:shadow-xl active:scale-95"
              }
            `}
          >
            {isFlipping ? "Flipping..." : "Flip Coin"}
          </button>
        </div>
      )}

      {/* Toss Result → Choose bat/bowl */}
      {tossWinner && !tossDecision && (
        <div className="max-w-md mx-auto animate-slide-up">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
            <div className="space-y-2">
              <div className="text-5xl animate-bounce-subtle">🎉</div>
              <h2 className="text-2xl font-extrabold text-slate-800">
                {tossWinner} won the toss!
              </h2>
              <p className="text-slate-500">
                What will {tossWinner} choose?
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleDecision("bat")}
                className="flex-1 py-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="text-2xl block mb-1">🏏</span>
                Bat First
              </button>
              <button
                onClick={() => handleDecision("bowl")}
                className="flex-1 py-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="text-2xl block mb-1">⚾</span>
                Bowl First
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decision Made → Transition */}
      {tossDecision && (
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
            <p className="text-lg font-bold text-emerald-800">
              {tossWinner} elected to {tossDecision} first
            </p>
            <p className="text-emerald-600 animate-pulse font-medium">
              Starting match...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toss;
