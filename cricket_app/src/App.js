import "./App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./component/home";
import Toss from "./component/toss";
import Play from "./component/play";
import AllMatch from "./component/allmatch";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <span className="text-3xl group-hover:animate-bounce-subtle">
              🏏
            </span>
            <span className="text-white font-bold text-xl tracking-wide">
              Cricket Game
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-emerald-200 hover:bg-emerald-700/60 hover:text-white"
              }`}
            >
              New Match
            </Link>
            <Link
              to="/matches"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/matches"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-emerald-200 hover:bg-emerald-700/60 hover:text-white"
              }`}
            >
              All Matches
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <BrowserRouter>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/toss" element={<Toss />} />
            <Route path="/play" element={<Play />} />
            <Route path="/matches" element={<AllMatch />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
