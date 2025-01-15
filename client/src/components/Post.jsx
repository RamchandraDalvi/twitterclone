import { useContext, useState } from "react";
import Avatar from "react-avatar";
import { FiHeart, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import { FaBookmark } from "react-icons/fa";
import CommentsModal from "./CommentsModal";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { setPosts, setselectedPost } from "../redux/postSlice";
import myContext from "./Context/data/myContext";

const Post = ({ post }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalComment, setIsModalComment] = useState(false);
    const [text, setText] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const { user, userProfile } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.posts)
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
    const [postlike, setPostlike] = useState(post.likes.length)
    const [comm, setComment] = useState(post?.comments)
    const dispatch = useDispatch();
    const context = useContext(myContext);
    const { mode } = context;  // Mode from context (light or dark)

    const openCommentModal = () => setIsModalComment(true);
    const closeCommentModal = () => setIsModalComment(false);

    const handleCommentChange = (e) => setText(e.target.value);

    const toggleMenu = () => setShowMenu(prev => !prev);

    const deletePosthandler = async () => {
        try {
            const res = await axios.delete(`https://twitterclone-1-g05t.onrender.com/api/v1/post/delete/${post._id}/`, { withCredentials: true });
            if (res.data.success) {
                const updatedPosts = posts.filter((item) => item._id !== post?._id);
                dispatch(setPosts(updatedPosts))
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    const likeordislikehandler = async () => {
        try {
            const action = liked ? "dislike" : "like";
            const res = await axios.get(`https://twitterclone-1-g05t.onrender.com/api/v1/post/${post?._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedlikes = liked ? postlike - 1 : postlike + 1;
                setPostlike(updatedlikes)
                setLiked(!liked)
                const updatedPost = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user?._id) : [...p.likes, user?._id]
                    } : p
                )
                dispatch(setPosts(updatedPost))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://twitterclone-1-g05t.onrender.com/api/v1/post/${post?._id}/bookmarks`, { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    const commentHandler = async () => {
        try {
            const res = await axios.post(
                `https://twitterclone-1-g05t.onrender.com/api/v1/post/${post?._id}/comment`,
                { text },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            if (res.data.success) {
                const updatedCommentData = [...comm, res.data.comment];
                setComment(updatedCommentData);  // Correct update for comment data

                // Dispatch the updated posts to Redux
                const updatedPostData = posts.map(p =>
                    p?._id === post?._id ? { ...p, comments: updatedCommentData } : p
                );
                dispatch(setPosts(updatedPostData));  // Dispatch the updated posts to Redux

                toast.success(res.data.message);
                setText("");  // Reset the input text
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            {isModalComment && <CommentsModal closeCommentModal={closeCommentModal} />}

            <div className={`max-w-xl mx-auto p-4 rounded-lg shadow-md mb-8 ${mode === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                <div className="flex items-start relative">
                    <Avatar src={post.author?.profilePicture} size="40" round className="mr-4" />
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className={`font-bold ${mode === "dark" ? "text-white" : "text-black"}`}>{post.author?.name}</span>
                                <span className="text-gray-500">@{post.author?.username}</span>
                                <span className="text-gray-500"> · 2h</span>
                            </div>
                            <div className="relative">
                                {showMenu && (
                                    <>
                                <button onClick={toggleMenu} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                                    <FiMoreHorizontal size={24} />
                                </button>
                                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10">
                                        <ul className="py-2">
                                            {user && user?._id === post?.author?._id && (
                                                <li onClick={deletePosthandler} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">Delete</li>
                                            )}
                                        </ul>
                                    </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className={`mt-2 ${mode === "dark" ? "text-gray-200" : "text-gray-900"}`}>{post.caption}</p>

                        {/* Conditional rendering for image */}
                        {post.image && (
                            <img src={post.image} alt="Post" className="mt-2 rounded-lg w-full h-auto" />
                        )}

                        <div className={`flex justify-between items-center mt-4 ${mode === "dark" ? "text-gray-500" : "text-gray-700"}`}>
                            <div className="flex items-center">
                                <button onClick={likeordislikehandler} className="flex items-center">
                                    {liked ? <FaHeart color="red" className="mr-2" /> : <FiHeart className="mr-2" />}
                                    <span>{postlike}</span>
                                </button>
                            </div>
                            <div className="flex items-center">
                                <button onClick={() => { dispatch(setselectedPost(post)); openCommentModal(); }} className="flex items-center">
                                    <FiMessageCircle className="mr-2" size={20} />
                                    <span>{post.comments.length}</span>
                                </button>
                            </div>
                            <div className="flex items-center">
                                <button onClick={bookmarkHandler} className="flex items-center">
                                    {userProfile?.bookmarks?.some(bookmark => bookmark._id === post._id) ? <FaBookmark size={20} /> : <BsBookmark className="mr-2" size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`mt-4 text-sm ${mode === "dark" ? "text-gray-300" : "text-gray-500"} cursor-pointer hover:underline`} onClick={() => { dispatch(setselectedPost(post)); openCommentModal(); }}>
                    View all {post.comments.length} comments
                </div>

                <div className={`flex items-center gap-3 p-4 border-t ${mode === "dark" ? "border-gray-700" : "border-gray-300"}`}>
                    <Avatar src={user?.profilePicture} size="40" round className="mr-4" />
                    <div className="flex-1">
                        <input
                            type="text"
                            value={text}
                            onChange={handleCommentChange}
                            placeholder="Add a comment..."
                            className={`w-full p-2 rounded-full focus:outline-none focus:ring-2 ${mode === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-black border-gray-300"}`}
                        />
                    </div>
                    <button
                        onClick={commentHandler}
                        className={`text-blue-500 hover:text-blue-700 px-4 py-2 rounded-full focus:outline-none ${mode === "dark" ? "text-white" : "text-black"}`}
                    >
                        Post
                    </button>
                </div>
            </div>
        </>
    );
};

export default Post;
