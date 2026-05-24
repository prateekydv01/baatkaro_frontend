import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { logoutUser } from '../../api/auth';
import { Link,Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import ContentLoggedIn from '../components/home/ContentLoggedIn';
import ContentLoggedOut from '../components/home/ContentLoggedOut';

function HomePage() {
  const { status } = useSelector(
          (state) => state.auth
      );
  
 
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition">

      <Navbar />

      {status
                ? <ContentLoggedIn />
                : <ContentLoggedOut />
            }
    </div>
  );
}

export default HomePage