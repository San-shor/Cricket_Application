import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";


const TossResult = ({ teams }) => {
    const [selectedTeam, setSelectedTeam] = useState("");
    const navigate = useNavigate();
    
  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
  };
  const handlePlay = async () => {
    try {
      const response = await fetch("http://localhost:4000/teams");
      const data = await response.json()
      console.log(data,selectedTeam)
      let id
     data.forEach(element => {
        if(element.team===selectedTeam){
            id=element.id
        }
      });;
      console.log(data)
         
      navigate(`/play/${id}`);
    } catch (error) {
      console.log("Error occurred while fetching the API:", error);
    }
  };
  
  

  const getCountryFlagImageUrl = (team) => {
    switch (team) {
        case "Bangladesh":
          return "https://www.countryflags.com/wp-content/uploads/flag-jpg-xl-14-2048x1229.jpg";
        case "India":
          return "https://www.countryflags.com/wp-content/uploads/india-flag-png-large.png";
        case "Pakistan":
          return "https://www.countryflags.com/wp-content/uploads/pakistan-flag-png-large.png";
        case "Australia":
          return "https://www.countryflags.com/wp-content/uploads/flag-jpg-xl-9-2048x1024.jpg";
        case "England":
          return "https://www.countryflags.com/wp-content/uploads/finland-flag-png-large.png";
        case "Sri Lanka":
          return "https://www.countryflags.com/wp-content/uploads/sri-lanka-flag-png-large.png";
        default:
          return "";
      }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Select who will bowl</h2>
      <ul className="space-y-2">
        {teams.map((team) => (
          <li key={team}>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="bowl"
                value={team}
                checked={selectedTeam === team}
                onChange={() => handleTeamSelect(team)}
                className="form-radio h-5 w-5 text-blue-500"
              />
              <img
                src={getCountryFlagImageUrl(team)}
                alt={team}
                className="h-16 w-16 "
              />
              <span className="font-medium">{team}</span>
            </label>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handlePlay}
      >
        Play
      </button>
    </div>
  );
};

export default TossResult;
