import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

const SearchModal = ({ setOpenSearch }) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // API call to search users
  const searchUsers = async (searchTerm) => {
    if (!searchTerm) {
      setSearchResults([]); // Clear results if query is empty
      return;
    }

    try {
      const res = await axios.get(
        `https://twitterclone-1-g05t.onrender.com/api/v1/user/search?search=${searchTerm}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Ensure credentials (cookies) are included in the request
        }
      );
      setSearchResults(res.data.users || []); // Set the search results
    } catch (error) {
      console.error('Error searching users:', error.message || error);
      toast.error('Error searching users.');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchUsers(value); // Trigger search when input changes
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg relative">
        {/* Close Button */}
        <button className="absolute -top-1 right-2 text-md p-1 rounded-full" onClick={() => setOpenSearch(false)}>
          X
        </button>

        {/* Search Input */}
        <div className="flex items-center mb-4 p-2 border border-gray-300 rounded-md">
          <FiSearch className="text-gray-500 mx-2" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="flex-1 bg-transparent outline-none text-lg"
          />
        </div>

        {/* Show Search Results */}
        <div className="mb-6">
          {searchResults.length > 0 ? (
            <ul className="list-none p-0 m-0 border-t border-gray-300 max-h-52 overflow-y-auto">
              {searchResults.map((user) => (
                <li key={user._id} className="flex items-center p-3 cursor-pointer hover:bg-gray-100">
                  <Link to={`/profile/${user._id}`} className="flex items-center w-full" onClick={()=>setOpenSearch(false)}>
                    <Avatar src={user.profilePicture} size="50" round={true} />
                    <div className="ml-3">
                      <h1 className="font-semibold">{user.name}</h1>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            search && <p className="text-sm text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
