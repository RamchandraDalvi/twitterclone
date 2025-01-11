import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import SuggestedUsers from "./SuggestedUsers";
import { useContext, useState } from "react";
import myContext from "./Context/data/myContext";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { Link } from "react-router-dom";

const Rightsidebar = () => {
  const context = useContext(myContext);
  const { mode } = context;
  const { likeNotification } = useSelector((state) => state.realTimeNotification);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // API call to search users without debounce
  const searchUsers = async (searchTerm) => {
    if (!searchTerm) {
      setSearchResults([]); // Clear results if query is empty
      return;
    }

    try {
      console.log("Search Term:", searchTerm); // Debugging line: log the search term
      const res = await axios.get(`http://localhost:8000/api/v1/user/search?search=${searchTerm}`, {
        headers: {
          "Content-Type": "application/json", // Set content type to application/json
        },
        withCredentials: true, // Ensure credentials (cookies) are included in the request
      });
      console.log("Search Results:", res.data.users); // Debugging line: log the search results
      setSearchResults(res.data.users || []); // Set the search results
    } catch (error) {
      console.error("Error searching users:", error.message || error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchUsers(value); // Trigger search when input changes
  };

  return (
    <div
      className={`hidden lg:block w-[25%] p-4 ${mode === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
    >
      {/* Search Input */}
      <div
        className={`flex items-center mb-6 rounded-full shadow-lg p-2 ${mode === "dark" ? "bg-gray-800" : "bg-gray-200"}`}
      >
        <FiSearch className="text-gray-500 mx-2" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className={`flex-1 bg-transparent p-2 rounded-full outline-none text-sm ${mode === "dark" ? "text-white" : "text-black"}`}
        />
      </div>

      {/* Search Results Section */}
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>
          Search Results
        </h2>
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <Link to={`/profile/${user?._id}`} key={user._id} className="flex items-center mb-4 mt-3 bg-gray-200 p-2 rounded-full">
              <Avatar src={user.profilePicture} size="50" round />
             <div>
             <h1 className="font-semibold ml-3">{user?.name}</h1>
             <p className="ml-3">@{user.username}</p>
             </div>
            </Link>
          ))
        ) : (
          search && <p className="text-sm text-gray-500">No users found.</p>
        )}
      </div>

      {/* Suggested Users Section */}
      <SuggestedUsers mode={mode} />

      {/* Recent Activity Section */}
      <div className={`shadow-lg rounded-lg p-4 mb-6 ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <h2 className={`text-xl font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-black"}`}>Recent Activity</h2>
        {likeNotification.map((notify) => (
          <div key={notify?._id} className="flex items-center mb-4">
            <Avatar src={notify?.userDetails?.profilePicture} size="30" round={true} />
            <span className={`ml-3 text-sm ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              <strong>{notify?.userDetails?.username}</strong> liked your post
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rightsidebar;
