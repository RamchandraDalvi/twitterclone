import axios from "axios";
import { useEffect } from "react";
import {useDispatch} from "react-redux"
import { setsuggestedUsers } from "../redux/authSlice";

export const useGetSuggestUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(
                    "https://twitterclone-1-g05t.onrender.com/api/v1/user/suggestedusers",
                    { withCredentials: true }
                );

                // Check if the response indicates success
                if (res.data.success) {
                    dispatch(setsuggestedUsers(res.data.users));
                } 
            } catch (error) {
                // Log the error with a more descriptive message
                console.error("Error fetching posts:", error.message || error);
            }
        };

        fetchSuggestedUsers();
    }, []); // Empty dependency array ensures this runs only once on mount
};
