import React, { useState, useRef } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { getCountryFlagImageUrl, getTeamAbbr, API_BASE } from "../utils/flagUtils";

const BALLS_PER_INNINGS = 12; // 2 overs
const MAX_WICKETS = 10;

/** Random ball outcome with realistic probabilities */
const getBallOutcome = () => {
  const rand = Math.random() * 100;
  if (rand < 18) return 0; // 18% dot ball
  if (rand < 43) return 1; // 25% single
  if (rand < 58) return 2; // 15% double
  if (rand < 63) return 3; // 5% triple
  if (rand < 78) return 4; // 15% four
  if (rand < 88) return 6; // 10% six
  return "W"; // 12% wicket
};

/** Format ball count to overs (e.g., 7 balls → "1.1") */
const formatOvers = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;

/** Get the Tailwind classes for a ball outcome badge */
const getOutcomeStyle = (outcome) => {
  if (outcome === "W") return "bg-red-500 text-white glow-wicket";
  if (outcome === 6) return "bg-amber-400 text-white glow-six";
  if (outcome === 4) return "bg-emerald-500 text-white glow-four";
  if (outcome === 0) return "bg-slate-200 text-slate-500";
  return "bg-blue-100 text-blue-700";
};

/** Get display label for a ball outcome */
const getOutcomeLabel = (outcome) => {
  if (outcome === "W") return "W";
  if (outcome === 0) return "•";
  return String(outcome);
};

const Play = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const matchConfig = location.state;
  const ballKeyRef = useRef(0); // unique key for animation reset

  // Game state
  const [innings, setInnings] = useState(1);
  const [balls, setBalls] = useState([]);
  const [wickets, setWickets] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);
  const [ballCount, setBallCount] = useState(0);
  const [innings1Result, setInnings1Result] = useState(null);
  const [matchOver, setMatchOver] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [lastBall, setLastBall] = useState(null);
  const [animating, setAnimating] = useState(false);

  // Redirect if no match config
  if (!matchConfig || !matchConfig.teams || matchConfig.teams.length < 2) {
    return <Navigate to="/" replace />;
  }

  const { teams, tossWinner, tossDecision, battingFirst, bowlingFirst } =
    matchConfig;

  const currentBatting = innings === 1 ? battingFirst : bowlingFirst;
  const currentBowling = innings === 1 ? bowlingFirst : battingFirst;
  const target = innings1Result ? innings1Result.runs + 1 : null;

  const isInnings1Over =
    innings === 1 &&
    (ballCount >= BALLS_PER_INNINGS || wickets >= MAX_WICKETS);
  const canBowl = !matchOver && !isInnings1Over && !animating;

  // ─── Bowl handler ───
  const handleBowl = () => {
    if (!canBowl) return;
    setAnimating(true);
    setLastBall(null);

    setTimeout(() => {
      const outcome = getBallOutcome();
      const newBallCount = ballCount + 1;
      let newRuns = totalRuns;
      let newWickets = wickets;

      if (outcome === "W") {
        newWickets += 1;
      } else {
        newRuns += outcome;
      }

      ballKeyRef.current += 1;

      setBalls((prev) => [
        ...prev,
        {
          ball: newBallCount,
          over: formatOvers(newBallCount),
          outcome,
          totalRuns: newRuns,
          wickets: newWickets,
        },
      ]);
      setBallCount(newBallCount);
      setTotalRuns(newRuns);
      setWickets(newWickets);
      setLastBall(outcome);
      setAnimating(false);

      // Innings 2 end conditions
      if (innings === 2) {
        if (target && newRuns >= target) {
          finishMatch(newRuns, newWickets, newBallCount, "chase");
        } else if (
          newBallCount >= BALLS_PER_INNINGS ||
          newWickets >= MAX_WICKETS
        ) {
          finishMatch(newRuns, newWickets, newBallCount, "defend");
        }
      }
    }, 350);
  };

  // ─── Start second innings ───
  const startSecondInnings = () => {
    const inn1 = {
      team: battingFirst,
      runs: totalRuns,
      wickets,
      balls: ballCount,
      overs: formatOvers(ballCount),
    };
    setInnings1Result(inn1);
    setInnings(2);
    setBalls([]);
    setWickets(0);
    setTotalRuns(0);
    setBallCount(0);
    setLastBall(null);
  };

  // ─── Finish the match ───
  const finishMatch = (runs2, wickets2, balls2, type) => {
    const inn2 = {
      team: bowlingFirst,
      runs: runs2,
      wickets: wickets2,
      balls: balls2,
      overs: formatOvers(balls2),
    };

    let winner, margin;
    // innings1Result is guaranteed set before innings 2 starts
    const inn1Runs = innings1Result.runs;

    if (type === "chase") {
      winner = bowlingFirst;
      const rem = MAX_WICKETS - wickets2;
      margin = `Won by ${rem} wicket${rem !== 1 ? "s" : ""}`;
    } else {
      if (inn1Runs > runs2) {
        winner = battingFirst;
        const diff = inn1Runs - runs2;
        margin = `Won by ${diff} run${diff !== 1 ? "s" : ""}`;
      } else if (inn1Runs === runs2) {
        winner = "Tie";
        margin = "Match Tied!";
      } else {
        winner = bowlingFirst;
        const diff = runs2 - inn1Runs;
        margin = `Won by ${diff} run${diff !== 1 ? "s" : ""}`;
      }
    }

    setMatchResult({ winner, margin, innings2: inn2 });
    setMatchOver(true);
    saveMatch(inn2, winner, margin);
  };

  // ─── Save match result to server ───
  const saveMatch = async (inn2, winner, margin) => {
    try {
      await fetch(`${API_BASE}/cricket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teams,
          tossWinner,
          tossDecision,
          innings1: {
            team: innings1Result.team,
            runs: innings1Result.runs,
            wickets: innings1Result.wickets,
            overs: innings1Result.overs,
          },
          innings2: {
            team: inn2.team,
            runs: inn2.runs,
            wickets: inn2.wickets,
            overs: inn2.overs,
          },
          winner,
          margin,
        }),
      });
    } catch (error) {
      console.log("Failed to save match:", error);
    }
  };

  // ─── Derived display data ───
  const recentBalls = balls.slice(-6);
  const runsNeeded = target ? target - totalRuns : null;
  const ballsRemaining = BALLS_PER_INNINGS - ballCount;

  // ─────────── RENDER ───────────
  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Scoreboard ── */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Match Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-6 py-3 flex items-center justify-between">
          <span className="text-emerald-200 text-sm font-medium">
            {matchOver
              ? "Match Complete"
              : innings === 1
              ? "1st Innings"
              : "2nd Innings"}
          </span>
          <span className="text-emerald-200 text-sm">
            🏏 {tossWinner} won toss · elected to {tossDecision}
          </span>
        </div>

        {/* Score Row */}
        <div className="grid grid-cols-2 divide-x divide-slate-100">
          {/* Team 1 (batted first) */}
          <div
            className={`p-5 transition-colors duration-300 ${
              currentBatting === battingFirst && !matchOver
                ? "bg-emerald-50"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={getCountryFlagImageUrl(battingFirst)}
                alt={battingFirst}
                className="w-10 h-10 rounded-lg object-cover shadow"
              />
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  {getTeamAbbr(battingFirst)}
                  {currentBatting === battingFirst && !matchOver && (
                    <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      BATTING
                    </span>
                  )}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {innings === 1
                    ? `${totalRuns}/${wickets}`
                    : innings1Result
                    ? `${innings1Result.runs}/${innings1Result.wickets}`
                    : "—"}
                  <span className="text-sm font-medium text-slate-400 ml-2">
                    (
                    {innings === 1
                      ? formatOvers(ballCount)
                      : innings1Result
                      ? innings1Result.overs
                      : "0.0"}{" "}
                    ov)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Team 2 (bats second) */}
          <div
            className={`p-5 transition-colors duration-300 ${
              currentBatting === bowlingFirst && !matchOver
                ? "bg-emerald-50"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={getCountryFlagImageUrl(bowlingFirst)}
                alt={bowlingFirst}
                className="w-10 h-10 rounded-lg object-cover shadow"
              />
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  {getTeamAbbr(bowlingFirst)}
                  {innings === 2 && !matchOver && (
                    <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      BATTING
                    </span>
                  )}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {innings === 2
                    ? `${totalRuns}/${wickets}`
                    : innings1Result
                    ? "—"
                    : "Yet to bat"}
                  <span className="text-sm font-medium text-slate-400 ml-2">
                    {innings === 2
                      ? `(${formatOvers(ballCount)} ov)`
                      : ""}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Target info bar (innings 2) */}
        {innings === 2 && target && !matchOver && (
          <div className="bg-amber-50 border-t border-amber-100 px-6 py-2.5 text-center">
            <span className="text-amber-800 font-semibold text-sm">
              🎯 Target: {target} · Need{" "}
              <span className="font-black">{runsNeeded > 0 ? runsNeeded : 0}</span>{" "}
              runs from <span className="font-black">{ballsRemaining}</span>{" "}
              balls
            </span>
          </div>
        )}
      </div>

      {/* ── Active Play Area ── */}
      {!matchOver && !isInnings1Over && (
        <div className="flex flex-col items-center space-y-6">
          {/* Last Ball Outcome */}
          {lastBall !== null && (
            <div
              key={ballKeyRef.current}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black
                animate-ball-delivery
                ${getOutcomeStyle(lastBall)}
                ${lastBall === "W" ? "animate-wicket-shake" : ""}
              `}
            >
              {getOutcomeLabel(lastBall)}
            </div>
          )}

          {/* This Over */}
          {recentBalls.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
                This Over
              </span>
              {recentBalls.map((b, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${getOutcomeStyle(
                    b.outcome
                  )}`}
                >
                  {getOutcomeLabel(b.outcome)}
                </div>
              ))}
            </div>
          )}

          {/* Bowl Button */}
          <button
            onClick={handleBowl}
            disabled={!canBowl}
            className={`
              px-12 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200
              ${
                animating
                  ? "bg-slate-300 text-slate-500 cursor-wait scale-95"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105 hover:shadow-xl active:scale-95"
              }
            `}
          >
            {animating ? "Bowling..." : "🏏 Bowl"}
          </button>

          {/* Ball & Over Counter */}
          <p className="text-slate-400 text-sm">
            Ball {ballCount}/{BALLS_PER_INNINGS} · Over{" "}
            {formatOvers(ballCount)}/{BALLS_PER_INNINGS / 6}.0
          </p>
        </div>
      )}

      {/* ── Innings 1 Summary & Start 2nd Innings ── */}
      {isInnings1Over && !matchOver && (
        <div className="max-w-md mx-auto animate-slide-up">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center space-y-5">
            <div className="text-4xl">🏏</div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              End of 1st Innings
            </h2>
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-3">
                <img
                  src={getCountryFlagImageUrl(battingFirst)}
                  alt={battingFirst}
                  className="w-10 h-10 rounded-lg object-cover shadow"
                />
                <div>
                  <p className="font-bold text-slate-700">
                    {battingFirst}
                  </p>
                  <p className="text-3xl font-black text-slate-900">
                    {totalRuns}/{wickets}
                    <span className="text-sm font-medium text-slate-400 ml-2">
                      ({formatOvers(ballCount)} ov)
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-500">
                <span className="font-bold text-slate-700">
                  {bowlingFirst}
                </span>{" "}
                needs{" "}
                <span className="font-black text-emerald-600">
                  {totalRuns + 1}
                </span>{" "}
                runs to win
              </p>
              <button
                onClick={startSecondInnings}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Start 2nd Innings ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Match Result ── */}
      {matchOver && matchResult && (
        <div className="max-w-lg mx-auto animate-celebrate">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Winner Banner */}
            <div
              className={`py-6 px-8 text-center ${
                matchResult.winner === "Tie"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600"
                  : "bg-gradient-to-r from-amber-400 to-amber-500"
              }`}
            >
              <div className="text-4xl mb-2">
                {matchResult.winner === "Tie" ? "🤝" : "🏆"}
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                {matchResult.winner === "Tie"
                  ? "It's a Tie!"
                  : `${matchResult.winner} Wins!`}
              </h2>
              <p className="text-white/80 font-medium mt-1">
                {matchResult.margin}
              </p>
            </div>

            {/* Scorecard Summary */}
            <div className="p-6 space-y-4">
              {/* Innings 1 */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getCountryFlagImageUrl(innings1Result.team)}
                    alt={innings1Result.team}
                    className="w-9 h-9 rounded-lg object-cover shadow"
                  />
                  <span className="font-bold text-slate-700">
                    {innings1Result.team}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-slate-900">
                    {innings1Result.runs}/{innings1Result.wickets}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">
                    ({innings1Result.overs} ov)
                  </span>
                </div>
              </div>

              {/* Innings 2 */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getCountryFlagImageUrl(matchResult.innings2.team)}
                    alt={matchResult.innings2.team}
                    className="w-9 h-9 rounded-lg object-cover shadow"
                  />
                  <span className="font-bold text-slate-700">
                    {matchResult.innings2.team}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-slate-900">
                    {matchResult.innings2.runs}/{matchResult.innings2.wickets}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">
                    ({matchResult.innings2.overs} ov)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  🏏 New Match
                </button>
                <button
                  onClick={() => navigate("/matches")}
                  className="flex-1 py-3 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-bold rounded-xl shadow hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  📋 All Matches
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Ball-by-Ball Log ── */}
      {balls.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">
              📊 Ball-by-Ball ·{" "}
              <span className="text-emerald-600">
                {currentBatting} batting
              </span>
            </h3>
          </div>
          <div className="overflow-x-auto custom-scrollbar max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Over
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Ball
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                    Result
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {balls.map((b, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-slate-600 font-mono">
                      {b.over}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      #{b.ball}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${getOutcomeStyle(
                          b.outcome
                        )}`}
                      >
                        {getOutcomeLabel(b.outcome)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-800">
                      {b.totalRuns}/{b.wickets}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
