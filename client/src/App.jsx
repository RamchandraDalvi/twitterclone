import Signup from './components/Signup';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from './components/Login';
import Mainlayout from './components/Mainlayout';
import Home from './components/Home';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Chatpage from './components/Chatpage';
import io from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import NotificationPage from './components/NotificationPage';
import MyState from './components/Context/data/myState';
import ProtectedRoute from './components/ProtectedRoute';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Mainlayout /></ProtectedRoute>,
    children: [
      {
        path: "/",
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      {
        path: "/profile/:id",
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: "/profile/edit",
        element: <ProtectedRoute><EditProfile /></ProtectedRoute>
      },
      {
        path: "/chat",
        element: <ProtectedRoute><Chatpage /></ProtectedRoute>
      },
      {
        path: "/notification",
        element: <ProtectedRoute><NotificationPage /></ProtectedRoute>
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  }
])

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth)
  const { socket } = useSelector(store => store.socketio)
  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <MyState>
        <Toaster position="top-center" />
        <RouterProvider router={browserRouter} />
      </MyState>
    </>
  );
}

export default App;
