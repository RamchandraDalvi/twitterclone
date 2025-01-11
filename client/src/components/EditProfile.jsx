import axios from 'axios';
import { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../redux/authSlice';
import myContext from './Context/data/myContext';

const EditProfile = () => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { mode } = useContext(myContext); // Access mode from context

    // State Initialization
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture || '',
        profilePreview: user?.profilePicture || '', // Preview of the profile image
        bio: user?.bio || '',
        gender: user?.gender || 'male',
        name: user?.name || '',
    });

    // File Change Handler
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({
                ...input,
                profilePhoto: file, // Update file for backend
                profilePreview: URL.createObjectURL(file), // Update preview
            });
        }
    };

    // Gender Change Handler
    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    };

    // Edit Handler: Submit Form
    const editHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("name", input.name);
        formData.append("gender", input.gender);
        if (input.profilePhoto instanceof File) {
            formData.append("profilePhoto", input.profilePhoto);
        }

        try {
            const res = await axios.post("https://twitterclone-1-g05t.onrender.com/api/v1/user/profile/edit", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user?.gender,
                    name:res.data.user?.name
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "An error occurred while updating profile.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className={`min-h-screen ${mode === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-black'} flex flex-col items-center`}>
    <main className={`w-full max-w-3xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md mt-6 p-6`}>
        <h1 className={`font-bold text-2xl text-center mb-6 ${mode === 'dark' ? 'text-white' : 'text-black'}`}>Edit Profile</h1>

        {/* Profile Header */}
        <div className={`flex flex-col sm:flex-row items-center justify-between ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4 shadow-md mb-6`}>
            <div className="flex items-center gap-3 sm:flex-row flex-col">
                <div className="h-16 w-16 rounded-full bg-gray-300">
                    <img
                        src={input.profilePreview || "default-profile-picture-url"}
                        alt="profile"
                        className="h-full w-full object-cover rounded-full"
                    />
                </div>
                <div className="sm:ml-4 text-center sm:text-left">
                    <h1 className={`font-semibold text-lg ${mode === 'dark' ? 'text-white' : 'text-black'}`}>{user?.name}</h1>
                    <span className={`text-gray-600 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user?.username || ""}</span>
                </div>
            </div>
            <input type="file" name="profilePhoto" onChange={fileChangeHandler} className="hidden" id="imageInput" />
            <button
                onClick={() => document.getElementById("imageInput").click()}
                className={`bg-blue-500 h-8 px-4 rounded-md text-white font-semibold hover:bg-blue-600 ${mode === 'dark' ? 'bg-blue-700' : 'bg-blue-500'}`}
            >
                Change Photo
            </button>
        </div>

        {/* Bio Section */}
        <div className="mb-6">
            <h1 className={`font-semibold text-lg mb-2 ${mode === 'dark' ? 'text-white' : 'text-black'}`}>Bio</h1>
            <input
            type='text'
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
                className={`focus-visible:ring-transparent w-full p-3 border border-gray-300 rounded-md shadow-sm ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                placeholder="Enter your name here..."
            />
            <textarea
                value={input.bio}
                onChange={(e) => setInput({ ...input, bio: e.target.value })}
                className={`focus-visible:ring-transparent w-full p-3 border border-gray-300 rounded-md shadow-sm ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                rows="4"
                placeholder="Enter your bio here..."
            ></textarea>
        </div>

        {/* Gender Section */}
        <div className="mb-6">
            <h1 className={`font-semibold text-lg mb-2 ${mode === 'dark' ? 'text-white' : 'text-black'}`}>Gender</h1>
            <select
                onChange={(e) => selectChangeHandler(e.target.value)}
                value={input.gender}
                className={`w-full p-3 border border-gray-300 rounded-md shadow-sm ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>

        {/* Submit Button Section */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
                onClick={editHandler}
                className={`bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md text-white font-semibold shadow-lg ${mode === 'dark' ? 'bg-blue-700' : 'bg-blue-500'}`}
            >
                Save Changes
            </button>
            <button
                onClick={() => navigate(-1)}
                className={`bg-gray-400 hover:bg-gray-500 px-6 py-2 rounded-md text-white font-semibold shadow-lg ${mode === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`}
            >
                Cancel
            </button>
        </div>
    </main>
</div>

    );
};

export default EditProfile;
