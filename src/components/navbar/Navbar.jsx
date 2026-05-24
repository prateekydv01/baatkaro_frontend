import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../store/authSlice";

import { logoutUser } from "../../../api/auth";

import {
   useNavigate,
   useLocation
} from "react-router-dom";

import ThemeButton from "./ThemeButton";

import {
   Menu,
   X,
   MessageCircle,
   Users
} from "lucide-react";

function Navbar() {

   const dispatch = useDispatch();

   const navigate = useNavigate();

   const location = useLocation();

   const [menuOpen, setMenuOpen] =
      useState(false);

   const { status, userData } =
      useSelector(
         (state) => state.auth
      );

   const handleLogout = async () => {

      try {

         await logoutUser();

         dispatch(logout());

         navigate("/login");

      } catch (error) {

         console.log(error);

      }

   };

   const isActive = (path) =>
      location.pathname === path;

   return (

      <nav
         className="
            sticky top-0 z-50

            bg-white/80 dark:bg-black/80
            backdrop-blur-xl

            border-b border-zinc-200
            dark:border-zinc-800
         "
      >

         <div
            className="
               h-16
               px-4 md:px-6

               flex items-center justify-between
            "
         >

            {/* LEFT */}

            <div
               onClick={() => navigate("/")}
               className="
                  flex items-center gap-2
                  cursor-pointer
               "
            >

               <div
                  className="
                     h-9 w-9 rounded-2xl

                     bg-black text-white
                     dark:bg-white dark:text-black

                     flex items-center justify-center

                     font-bold text-sm
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
                  Baat Karo
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
                        className={`
                           flex items-center gap-2

                           px-4 py-2 rounded-xl

                           transition

                           ${
                              isActive("/friends")
                                 ? "bg-black text-white dark:bg-white dark:text-black"
                                 : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                           }
                        `}
                     >

                        <Users size={18} />

                        Friends

                     </button>

                     <button
                        onClick={() => navigate("/chat")}
                        className={`
                           flex items-center gap-2

                           px-4 py-2 rounded-xl

                           transition

                           ${
                              isActive("/chat")
                                 ? "bg-black text-white dark:bg-white dark:text-black"
                                 : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                           }
                        `}
                     >

                        <MessageCircle size={18} />

                        Chats

                     </button>

                  </>

               )}

               <ThemeButton />

               {status ? (

                  <>

                     <div
                        className="
                           h-10 w-10 rounded-full

                           bg-zinc-200 dark:bg-zinc-800

                           flex items-center justify-center

                           font-semibold
                           uppercase

                           text-black dark:text-white
                        "
                     >
                        {userData?.username?.charAt(0)}
                     </div>

                     <button
                        onClick={handleLogout}
                        className="
                           text-red-500
                           hover:text-red-600

                           text-sm font-medium
                        "
                     >
                        Logout
                     </button>

                  </>

               ) : (

                  <div className="flex items-center gap-3">

                     <button
                        onClick={() => navigate("/login")}
                        className="
                           text-zinc-600
                           dark:text-zinc-300

                           hover:text-black
                           dark:hover:text-white

                           transition
                        "
                     >
                        Login
                     </button>

                     <button
                        onClick={() => navigate("/signup")}
                        className="
                           px-4 py-2 rounded-xl

                           bg-black text-white

                           dark:bg-white
                           dark:text-black
                        "
                     >
                        Sign Up
                     </button>

                  </div>

               )}

            </div>

            {/* MOBILE MENU BUTTON */}

            <button
               onClick={() => setMenuOpen(!menuOpen)}
               className="
                  md:hidden

                  text-black
                  dark:text-white
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

                              hover:bg-zinc-100
                              dark:hover:bg-zinc-900
                           "
                        >

                           <MessageCircle size={18} />

                           Chats

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

                              bg-black text-white

                              dark:bg-white
                              dark:text-black
                           "
                        >
                           Sign Up
                        </button>

                     </>

                  )}

                  <div className="pt-2">
                     <ThemeButton />
                  </div>

               </div>

            )
         }

      </nav>

   );

}

export default Navbar;