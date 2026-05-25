import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { logoutUser } from "../../../api/auth";
import { useLocation, useNavigate } from "react-router-dom";

import {
   Menu,
   X,
   MessageCircle,
   Users,
   Moon,
   Sun,
   Bell
} from "lucide-react";

function Navbar() {

   const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation();

   const [menuOpen, setMenuOpen] = useState(false);
   const [darkMode, setDarkMode] = useState(false);

   const { status, userData } = useSelector(
      (state) => state.auth
   );

   const { notifications } = useSelector(
   (state) => state.notification
);

const unreadCount =
   notifications.filter(
      (n)=>!n.isRead
   ).length;

   useEffect(() => {

      const savedTheme =
         localStorage.getItem("theme");

      if (savedTheme === "dark") {

         document.documentElement.classList.add("dark");
         setDarkMode(true);

      } else {

         document.documentElement.classList.remove("dark");
         setDarkMode(false);

      }

   }, []);

   const toggleTheme = () => {

      if (darkMode) {

         document.documentElement.classList.remove("dark");

         localStorage.setItem(
            "theme",
            "light"
         );

      } else {

         document.documentElement.classList.add("dark");

         localStorage.setItem(
            "theme",
            "dark"
         );

      }

      setDarkMode(!darkMode);

   };

   const handleLogout = async () => {

      try {

         await logoutUser();

         dispatch(logout());

         navigate("/login");

      } catch (error) {

         console.log(error);

      }

   };

   const navBtn = (active) =>
      `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
         active
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
      }`;

   return (

      <nav
         className="
            sticky top-0 z-50

            border-b border-zinc-200
            dark:border-zinc-800

            bg-white/70 dark:bg-black/70

            backdrop-blur-xl
         "
      >

         <div
            className="
               max-w-7xl mx-auto

               h-16 px-4

               flex items-center justify-between
            "
         >

            {/* LOGO */}

            <div
               onClick={() => navigate("/")}
               className="
                  flex items-center gap-3
                  cursor-pointer
               "
            >

               <div
                  className="
                     h-10 w-10 rounded-2xl

                     bg-black dark:bg-white

                     text-white dark:text-black

                     flex items-center justify-center

                     font-bold
                  "
               >
                  BK
               </div>

               <h1
                  className="
                     text-lg md:text-xl

                     font-bold

                     text-black dark:text-white
                  "
               >
                  BaatKaro
               </h1>

            </div>

            {/* DESKTOP */}

            <div
               className="
                  hidden md:flex
                  items-center gap-3
               "
            >

               {status && (

                  <>

                     <button
                        onClick={() => navigate("/friends")}
                        className={navBtn(
                           location.pathname === "/friends"
                        )}
                     >

                        <div className="flex items-center gap-2">

                           <Users size={18} />

                           Friends

                        </div>

                     </button>
                     

                     <button
                        onClick={() => navigate("/chat")}
                        className={navBtn(
                           location.pathname === "/chat"
                        )}
                     >

                        <div className="flex items-center gap-2">

                           <MessageCircle size={18} />

                           Chats

                        </div>

                     </button>

                     <button
   onClick={() => navigate("/notifications")}
   className={navBtn(
      location.pathname === "/notifications"
   )}
>

   <div className="relative flex items-center gap-2">

      <Bell size={18} />


      {
         unreadCount > 0 && (

            <span
               className="
                  absolute
                  -top-2
                  -right-3

                  min-w-[18px]
                  h-[18px]

                  px-1

                  rounded-full

                  bg-red-500

                  text-white

                  text-[10px]
                  font-bold

                  flex
                  items-center
                  justify-center
               "
            >

               {
                  unreadCount > 99
                     ? "99+"
                     : unreadCount
               }

            </span>

         )
      }

   </div>

</button>

                  </>

               )}

               {/* THEME BUTTON */}

               <button
                  onClick={toggleTheme}
                  className="
                     h-10 w-10 rounded-xl

                     flex items-center justify-center

                     bg-zinc-100 dark:bg-zinc-900

                     text-black dark:text-white

                     transition
                  "
               >

                  {
                     darkMode
                        ? <Sun size={18} />
                        : <Moon size={18} />
                  }

               </button>

               {/* USER */}

               {status ? (

                  <div
                     className="
                        flex items-center gap-3
                        ml-2
                     "
                  >

                     <div
                        className="
                           h-10 w-10 rounded-full

                           bg-zinc-200 dark:bg-zinc-800

                           flex items-center justify-center

                           uppercase font-semibold

                           text-black dark:text-white
                        "
                     >

                        {userData?.username?.charAt(0)}

                     </div>

                     <button
                        onClick={handleLogout}
                        className="
                           text-sm font-medium

                           text-red-500
                           hover:text-red-600
                        "
                     >
                        Logout
                     </button>

                  </div>

               ) : (

                  <div className="flex items-center gap-2">

                     <button
                        onClick={() => navigate("/login")}
                        className="
                           px-4 py-2 rounded-xl

                           text-sm

                           text-black dark:text-white

                           hover:bg-zinc-100
                           dark:hover:bg-zinc-900
                        "
                     >
                        Login
                     </button>

                     <button
                        onClick={() => navigate("/signup")}
                        className="
                           px-4 py-2 rounded-xl

                           bg-black dark:bg-white

                           text-white dark:text-black

                           text-sm font-medium
                        "
                     >
                        Sign Up
                     </button>

                  </div>

               )}

            </div>

            {/* MOBILE BUTTON */}

            <button
               onClick={() => setMenuOpen(!menuOpen)}
               className="
                  md:hidden

                  text-black dark:text-white
               "
            >

               {
                  menuOpen
                     ? <X size={28} />
                     : <Menu size={28} />
               }

            </button>

         </div>

         {/* MOBILE MENU */}

         {
            menuOpen && (

               <div
                  className="
                     md:hidden

                     border-t border-zinc-200
                     dark:border-zinc-800

                     bg-white dark:bg-black

                     px-4 py-4

                     flex flex-col gap-2
                  "
               >

                  {status ? (

                     <>

                        <button
                           onClick={() => {
                              navigate("/friends");
                              setMenuOpen(false);
                           }}
                           className="
                              flex items-center gap-3

                              px-4 py-3 rounded-xl

                              text-black dark:text-white

                              hover:bg-zinc-100
                              dark:hover:bg-zinc-900
                           "
                        >

                           <Users size={18} />

                           Friends

                        </button>

                        <button
                           onClick={() => {
                              navigate("/chat");
                              setMenuOpen(false);
                           }}
                           className="
                              flex items-center gap-3

                              px-4 py-3 rounded-xl

                              text-black dark:text-white

                              hover:bg-zinc-100
                              dark:hover:bg-zinc-900
                           "
                        >

                           <MessageCircle size={18} />

                           Chats

                        </button>
                        <button
   onClick={() => {
      navigate("/notifications");
      setMenuOpen(false);
   }}
   className="
      flex items-center justify-between

      px-4 py-3 rounded-xl

      text-black dark:text-white

      hover:bg-zinc-100
      dark:hover:bg-zinc-900
   "
>

   <div className="flex items-center gap-3">

      <Bell size={18} />

      Notifications

   </div>

   {
      unreadCount > 0 && (

         <span
            className="
               min-w-[20px]
               h-[20px]

               px-1

               rounded-full

               bg-red-500

               text-white

               text-[11px]
               font-bold

               flex items-center justify-center
            "
         >

            {
               unreadCount > 99
                  ? "99+"
                  : unreadCount
            }

         </span>

      )
   }

</button>

                        <button
                           onClick={handleLogout}
                           className="
                              px-4 py-3 rounded-xl

                              text-left

                              text-red-500

                              hover:bg-red-50
                              dark:hover:bg-red-950/20
                           "
                        >
                           Logout
                        </button>

                     </>

                  ) : (

                     <>

                        <button
                           onClick={() => navigate("/login")}
                           className="
                              px-4 py-3 rounded-xl

                              text-left

                              text-black dark:text-white

                              hover:bg-zinc-100
                              dark:hover:bg-zinc-900
                           "
                        >
                           Login
                        </button>

                        <button
                           onClick={() => navigate("/signup")}
                           className="
                              px-4 py-3 rounded-xl

                              bg-black dark:bg-white

                              text-white dark:text-black
                           "
                        >
                           Sign Up
                        </button>

                     </>

                  )}

                  {/* MOBILE THEME */}

                  <button
                     onClick={toggleTheme}
                     className="
                        mt-2

                        h-12 rounded-xl

                        bg-zinc-100 dark:bg-zinc-900

                        flex items-center justify-center gap-2

                        text-black dark:text-white
                     "
                  >

                     {
                        darkMode
                           ? <Sun size={18} />
                           : <Moon size={18} />
                     }

                     Theme

                  </button>

               </div>

            )
         }

      </nav>

   );

}

export default Navbar;