import { useState, useEffect } from "react";

import "./App.css";

import { useDispatch, useSelector } from "react-redux";

import { Outlet } from "react-router-dom";

import toast from "react-hot-toast";

import { getCurrentUser } from "../api/auth.js";

import {
   getNotifications
} from "../api/notification.js";

import {
   login,
   logout
} from "./store/authSlice.js";

import {

   addNotification,

   setNotifications,

   updateNotification

} from "./store/notificationSlice.js";

import { socket } from "./socket/socket.js";

function App() {

   const dispatch = useDispatch();

   const [loading, setLoading] =
      useState(true);

   const { theme } = useSelector(
      (state) => state.theme
   );

   const user = useSelector(
      (state) => state.auth.userData
   );

   // Theme

   useEffect(() => {

      if (theme === "dark") {

         document.documentElement
            .classList.add("dark");

      }

      else {

         document.documentElement
            .classList.remove("dark");

      }

   }, [theme]);

   // Current User

   useEffect(() => {

      getCurrentUser()

         .then((res) => {

            if (res?.data?.user) {

               dispatch(

                  login({

                     userData:
                        res.data.user

                  })

               );

            }

            else {

               dispatch(logout());

            }

         })

         .catch(() => {

            dispatch(logout());

         })

         .finally(() => {

            setLoading(false);

         });

   }, [dispatch]);

   // Fetch Notifications

   const fetchNotifications =
   async () => {

      try {

         const res =
         await getNotifications();

         dispatch(

            setNotifications(

               res.data.notifications

            )

         );

      }

      catch (error) {

         console.log(error);

      }

   };

   // Connect Socket

   useEffect(() => {

      if (

         user?._id &&

         !socket.connected

      ) {

         socket.io.opts.query = {

            userId:user._id

         };

         socket.connect();

         fetchNotifications();

      }

   }, [user?._id]);

   // New Notification

   useEffect(() => {

      const handleNotification =
      (notification) => {

         dispatch(

            addNotification(
               notification
            )

         );

         toast(

            `${notification.senderId?.username} ${notification.message}`,

            {

               icon:false,

               style:{

                  background:
                     document.documentElement
                     .classList.contains("dark")

                        ? "#18181b"

                        : "#ffffff",

                  color:
                     document.documentElement
                     .classList.contains("dark")

                        ? "#ffffff"

                        : "#000000",

                  border:
                     document.documentElement
                     .classList.contains("dark")

                        ? "1px solid #27272a"

                        : "1px solid #e4e4e7",

                  borderRadius:"14px",

                  padding:"12px 16px",

                  fontSize:"14px"

               }

            }

         );

      };

      socket.on(

         "new-notification",

         handleNotification

      );

      return () => {

         socket.off(

            "new-notification",

            handleNotification

         );

      };

   }, [dispatch]);

   // Update Notification

   useEffect(() => {

      const handleUpdateNotification =
      (notification) => {

         dispatch(

            updateNotification(
               notification
            )

         );

      };

      socket.on(

         "update-notification",

         handleUpdateNotification

      );

      return () => {

         socket.off(

            "update-notification",

            handleUpdateNotification

         );

      };

   }, [dispatch]);

   // Disconnect Socket

   useEffect(() => {

      if (

         !user &&

         socket.connected

      ) {

         socket.disconnect();

      }

   }, [user]);

   // Loading

   if (loading) {

      return (

         <div>

            Loading...

         </div>

      );

   }

   return <Outlet />;

}

export default App;