import React from "react";
import {Link} from "react-router-dom";


const Toss = ({ setSelectedTeams,teams }) => {
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

  const handleMatch = () => {
    const selectedTeamsData = {
      teams: setSelectedTeams,
    };
  
    try {
      fetch("http://localhost:4000/cricket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTeamsData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Selected teams saved successfully:", data);
        })
        .catch((error) => {
          console.log("Failed to save selected teams:", error);
        });
    } catch (error) {
      console.log("Failed to save selected teams:", error);
    }
  };
  
  const canStartPlay = setSelectedTeams.length >= 2;
  return (
    
    <div className="flex justify-center items-center flex-wrap mt-28">
    {setSelectedTeams.map((team) => (
      <div key={team} className="flex items-center justify-center mx-2">
        <img
          src={getCountryFlagImageUrl(team)}
          alt={team}
          className="w-28 h-28"
        />
      </div>
    ))}
     <div>
                  {setSelectedTeams.length < 2 && (
                    <p className="text-red-500">One more team needed</p>
                  )}
                  <Link
                    to={canStartPlay ? "/toss" : "#"}
                    className={`${
                      canStartPlay ? "" : "opacity-50 cursor-not-allowed"
                    } text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium`}
                  >
                    Start Toss
                  </Link>
                </div>

  </div>
  
 
  
  
    
  );
};

export default Toss;
