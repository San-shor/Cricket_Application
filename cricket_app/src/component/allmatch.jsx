import React, { useEffect, useState } from "react";

const AllMatch = () => {
  const [match, setMatch] = useState([]);

  const fetchMatch = async () => {
    const result = await fetch("http://localhost:4000/cricket");
    const data = await result.json();
    setMatch(data);
  };
  const deleteMatch = async (id) => {
    await fetch(`http://localhost:4000/cricket/${id}`, {
      method: "DELETE",
    });
    fetchMatch(); 
  };



  useEffect(() => {
    fetchMatch();
  }, []);

  return (
    <div className="mt-4">
      {match.map((list, i) => (
        <div key={i} className="mb-2">
          <span className="text-lg font-bold">{list.teams[0]}</span>
          <span className="mx-2">vs</span>
          <span className="text-lg font-bold">{list.teams[1]}</span>
          <button className="btn btn-outline btn-error" onClick={() => deleteMatch(list.id)}>Delete</button>
        </div>
        
      ))}
     
    </div>
  );
};

export default AllMatch;
