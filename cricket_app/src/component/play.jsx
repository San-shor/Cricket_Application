import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";


const Play = () => {
    const [tossWinner,setToss]=useState('')
    const [runs, setRuns] = useState([]);
    const [match, setMatch] = useState([]);
    const [ballCount,setBallCount]=useState(0)
  const { id } = useParams();
  const fetchTossWinner=async()=>{
    try {
        const result=await fetch(`http://localhost:4000/teams/${id}`)
        const data=await result.json()
        setToss(data)
    } catch (error) {
        console.log(error)
    }
  }
  
  useEffect(()=>{
    fetchTossWinner()

  },[])
  const getRandomRun = () => {
    const runs = [1, 2, 3, 4, 6];
    return runs[Math.floor(Math.random() * 5)];
  };
  const handleBowl=async()=>{
    if (ballCount >= 12) {
        return;
      }
    const run = getRandomRun();
    setRuns([...runs, run]);
    setBallCount(ballCount + 1);
    try {
        const response = await fetch(`http://localhost:4000/teams/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ run }),
        });
  
        
    } catch (error) {
        console.log(error)
    }
    
    
    

  }
  const calculateTotalRuns = () => {
    return runs.reduce((total, run) => total + run, 0);
  };
  
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Let's Play Cricket</h1>
      <h2 className="text-xl mb-2">Vs</h2>
      {/* <h3 className="text-lg mb-2">ID: {id}</h3> */}
      <h3 className="text-lg mb-4">
        {tossWinner.team} has won the toss and elected to bowl first
      </h3>
      <p className="mt-4 text-lg">Total Runs: {calculateTotalRuns()}</p>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleBowl}
      >
        Bowl
      </button>
      {runs.length > 0 && (
        <div>
          <h3 className="text-lg mb-2">Bowl Results:</h3>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ball
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Run
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {runs.map((run, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{run}</td>
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
