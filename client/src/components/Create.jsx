import { useContext, useState } from "react";
import Avatar from "react-avatar";
import { FiImage } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { setPosts } from "../redux/postSlice";
import myContext from "./Context/data/myContext";
import { Link } from "react-router-dom";

const Create = () => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // For image preview
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.posts); // Access posts from the redux state
    const dispatch = useDispatch();
    const context = useContext(myContext);
    const { mode } = context;

    // Handle text change
    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    // Handle image upload and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const imageURL = URL.createObjectURL(file); // Preview the uploaded image
            setImagePreview(imageURL);
        }
    };

    // Handle post creation (similar to CreatePost logic)
    const handlePostSubmit = async () => {
        if (!text.trim()) {
            toast.error("Post content cannot be empty");
            return;
        }

        const formData = new FormData();
        formData.append("caption", text);
        if (image) {
            formData.append("image", image); // Attach the image to form data
        }

        try {
            const res = await axios.post("https://twitterclone-1-g05t.onrender.com/api/v1/post/addpost", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setPosts([res.data.post, ...posts])); // Add the new post to the state
                setText(""); // Clear text
                setImage(null); // Clear image
                setImagePreview(null); // Clear image preview
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div
            className={`p-5 m-3 max-w-2xl mx-auto border-b border-t overflow-hidden mb-8 transition-transform transform lg:ml-[27%] sm:ml-8 md:ml-12 ${mode === "dark" ? "bg-black text-white border-gray-700" : "bg-white text-black border-gray-300"
                }`}
        >
            {/* Header: Avatar and Username */}
            <div className="flex items-center gap-3">
                <a href={user ? `/profile/${user._id}` : '#'}>
                    <Avatar
                        src={user?.profilePicture || 'default-profile-picture.jpg'}
                        size="40"
                        round
                    />
                </a>
                <Link to={`/profile/${user?._id}`} className="">
                    <h1 className="font-semibold">{user?.name}</h1>
                    <p className="text-gray-500">@{user?.username}</p>
                </Link>
            </div>

            {/* Text Input */}
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="What's happening?"
                className={`w-full mt-3 p-3 rounded-lg focus:outline-none focus:ring-2 resize-none ${mode === "dark"
                    ? "bg-gray-800 text-gray-200 focus:ring-blue-500"
                    : "bg-gray-100 text-gray-700 focus:ring-blue-500"
                    }`}
                rows="4"
            ></textarea>

            {/* Image Upload */}
            {imagePreview && (
                <div className="mt-3">
                    <img src={imagePreview} alt="preview" className="w-full h-64 object-cover rounded-lg" />
                </div>
            )}

            <div className="flex items-center justify-between mt-4">
                {/* Image upload button */}
                <label htmlFor="image-upload" className="cursor-pointer hover:text-gray-700">
                    <FiImage size={24} />
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>

                {/* Submit button */}
                <button
                    onClick={handlePostSubmit}
                    className="py-2 px-4 rounded-full transition-all hover:bg-blue-600 text-white bg-blue-500"
                >
                    Tweet
                </button>
            </div>
        </div>
    );
};

export default Create;
