import React ,{useState}from "react";
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";
import Toss from "./toss";
import TossResult from "./tossResult";
import Play from "./play";
import AllMatch from "./allmatch";

const Home = () => {
    const [selectedTeams, setSelectedTeams] = useState([]);

    const handleTeamSelect = (team) => {
        if (selectedTeams.includes(team)) {
          setSelectedTeams(selectedTeams.filter((selectedTeam) => selectedTeam !== team));
        } else {
            console.log('selected')
          setSelectedTeams([...selectedTeams, team]);
          
        }
    
      
      
    }
    
  return (
    <div>
      <BrowserRouter>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 text-white font-bold">
                Cricket Game
              </div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                
                  <Link
                   to='/matches'
                    className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    All Matches
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="mt-8">
        <h2 className="text-center text-2xl font-bold mb-4">Let's Play Cricket</h2>
        <div className="flex justify-center items-center flex-wrap">
          <div className="flex justify-center items-center w-full">
          <div className="flex justify-center items-center w-full">
            
            <div className="flex justify-center items-center">
              <img
                src="https://www.countryflags.com/wp-content/uploads/flag-jpg-xl-14-2048x1229.jpg"
                alt="Bangladesh"
                className="w-28 h-28 mx-2"
                onClick={() => handleTeamSelect("Bangladesh")}
              />
              <img
            src="https://www.countryflags.com/wp-content/uploads/india-flag-png-large.png"
            alt="India"
            className="w-28 h-28mx-2"
            onClick={() => handleTeamSelect("India")}
          />
          <img
            src="https://www.countryflags.com/wp-content/uploads/pakistan-flag-png-large.png"
            alt="Pakistan"
            className="w-28 h-28 mx-2"
            onClick={() => handleTeamSelect("Pakistan")}
          />
          <img
            src="https://www.countryflags.com/wp-content/uploads/flag-jpg-xl-9-2048x1024.jpg"
            alt="Australia"
            className="w-28 h-28 mx-2"
            onClick={() => handleTeamSelect("Australia")}
          />
          <img
            src="https://www.countryflags.com/wp-content/uploads/finland-flag-png-large.png"
            alt="England"
            className="w-28 h-28 mx-2"
            onClick={() => handleTeamSelect("England")}
          />
          <img
            src="https://www.countryflags.com/wp-content/uploads/sri-lanka-flag-png-large.png"
            alt="Sri Lanka"
            className="w-28 h-28 mx-2"
            onClick={() => handleTeamSelect("Sri Lanka")}
          />
            </div>
          </div>
          </div>
         
          {/* Country selection */}
          
        <Routes>
         
          <Route path="/" element={<Toss setSelectedTeams={selectedTeams}/>} />     
          <Route
          path="/toss"
          element={<TossResult teams={selectedTeams} />}
        /> 
        <Route
          path="/play/:id"
          element={<Play  />}
        /> 
         <Route  path="/matches" element={<AllMatch/>}></Route>
        
        </Routes>
        
         
          
        </div>
      </div>
      </BrowserRouter>
    </div>
  );
};

export default Home;
