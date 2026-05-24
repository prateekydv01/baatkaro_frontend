import { useState ,useEffect} from 'react'
import './App.css'
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom"
import {getCurrentUser} from "../api/auth.js"
import { login, logout } from "./store/authSlice.js";
import { socket } from "./socket/socket.js";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);
  const { theme } = useSelector((state) => state.theme);
  const user = useSelector(
   (state) => state.auth.userData
);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);


  useEffect(() => {
      getCurrentUser()
        .then((res) => {
          if (res?.data?.user) {
            dispatch(login({ userData: res.data.user }));
          } else {
            dispatch(logout());
          }
        })
        .catch(() => dispatch(logout()))
        .finally(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {

      if(user?._id){

        socket.io.opts.query = {
          userId:user._id
        }

        socket.connect()
      }

      return ()=> socket.disconnect()

    },[user])

    if (loading) {
      return (
        <div>
          Loading...
        </div>
      );
    }
    
  return (
    <>
     <Outlet />
    </>
  )
}

export default App
