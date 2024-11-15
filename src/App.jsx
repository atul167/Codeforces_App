import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsername, setRating, setImageURL, setRank } from "./store/userSlice";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function App() {
  const [ratingFilter, setRatingFilter] = useState(1200);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const { rating, imageURL, rank  } = useSelector((state) => state.user);
  const range = 200;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cf"],
    queryFn: fetchdata,
  });

  async function fetchdata() {
    const res = await axios.get(
      "https://codeforces.com/api/problemset.problems"
    );
    return res.data;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-blue-600">Loading problems...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  const filterByRating = (mx) => {
    setRatingFilter(mx);
  }

  const filteredProblemss = data?.result.problems.filter((problem) => {
    // now we will write the condition 
    return (
      problem.rating <= ratingFilter && problem.rating >= ratingFilter - range
    );
  });
  const filteredProblems = filteredProblemss.slice(0, 100);

  async function fetchUser() {
    if (username) {
      const res = await axios.get(
        `https://codeforces.com/api/user.info?handles=${username}`
      );
      const user = res.data;
      if (user.status === "OK") {
        dispatch(setRank(user.result[0].rank));
        dispatch(setRating(user.result[0].rating));
        dispatch(setImageURL(user.result[0].avatar));
      }
    }
  }
  fetchUser();
  function getRankColor(rank) {
    switch (rank?.toLowerCase()) {
      case "newbie":
        return "bg-gray-400"; // Lighter gray
      case "pupil":
        return "bg-green-200"; // Softer green
      case "specialist":
        return "bg-green-300"; // Slightly muted green
      case "expert":
        return "bg-blue-300"; // Softer blue
      case "candidate master":
        return "bg-purple-300"; // Muted purple
      case "master":
        return "bg-orange-300"; // Softer orange
      case "international master":
        return "bg-orange-400"; // Less vibrant orange
      case "grandmaster":
      case "international grandmaster":
        return "bg-red-300"; // Muted red
      case "legendary grandmaster":
        return "bg-gray-900"; // Dark gray instead of pure black
      default:
        return "bg-gray-400"; // Default lighter gray
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">CodeForces Problems</h1>

      <div className="flex flex-wrap gap-2 mb-6 gap-x-4">
        <button
          onClick={() => filterByRating(1200)}
          className="px-4 py-2 bg-green-500 gap-x-2 text-white rounded hover:bg-green-600 transition-colors"
        >
          Easy (800-1200)
        </button>
        <button
          onClick={() => filterByRating(1600)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Medium (1200-1600)
        </button>
        <button
          onClick={() => filterByRating(2000)}

          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Hard (1600-2000)
        </button>
        <button
          onClick={() => filterByRating(2400)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Thoda Aaram Se Bhai (2000-2400)
        </button>
        <button
          onClick={() => filterByRating(2800)}
          className="px-4 py-2 bg-[#9d0909] text-white rounded "
        >
          Ye to na hoga (2400-2800)
        </button>

      </div>
      <input
        type="text"
        className="px-4 py-2 h-10 border rounded text-black"
        placeholder="Enter UserName"
        onKeyDown={(e) => {
          if (e.key === "Enter") setUsername(e.target.value);
        }}
      />
      <div className="flex items-center justify-center mt-4 gap-2 w-full">

        {username && <span className={` flex items-center px-2 py-1 h-12  text-white ${getRankColor(rank)}`}>
          {username}
        </span>
        }
        {rating && <p className={`flex items-center px-2 py-1 h-12 text-white ${getRankColor(rank)}`}> {rating}</p>}
        {imageURL &&
          <img src={imageURL} alt="User Avatar" className="w-12 h-12 ml-2" />
        }
        {rank &&
          <span className={`flex items-center px-2 py-1 h-12 text-white ${getRankColor(rank)}`}>{rank.toUpperCase()}</span>
        }
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredProblems?.map((problem) => (
            <div
              key={`${problem.contestId}-${problem.index}`}
              className="p-4 border rounded hover:bg-gray-50 transition-colors"
            >
              <a
                href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {problem.name}
              </a>
              {problem.rating && (
                <div className="text-sm text-gray-600 mt-1">
                  Rating: {problem.rating}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;