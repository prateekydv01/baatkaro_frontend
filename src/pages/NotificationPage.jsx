import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
   markNotificationRead
} from "../../api/notification";

import {
   markNotificationRead as markRead,
   removeNotification
} from "../store/notificationSlice";

import {
   deleteNotification
} from "../../api/notification";

import { Trash2 } from "lucide-react";

function NotificationPage() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { notifications } = useSelector(
      (state) => state.notification
   );

   const handleNotificationClick = async (
      notification
   ) => {

      try {

         if (!notification.isRead) {

            await markNotificationRead(
               notification._id
            );

            dispatch(
               markRead(notification._id)
            );

         }

         if (
            notification.message ===
            "sent you a message"
         ) {

            navigate(
               `/chat/${notification.senderId._id}`
            );

         }

         else if (

            notification.message ===
            "sent you a friend request"

            ||

            notification.message ===
            "accepted your friend request"

            ||

            notification.message ===
            "rejected your friend request"

         ) {

            navigate("/friends");

         }

      } catch (error) {

         console.log(error);

      }

   };

   const handleDeleteNotification =
   async(id)=>{

      try{

         await deleteNotification(id);

         dispatch(
            removeNotification(id)
         );

      }catch(error){

         console.log(error);

      }

   };

   return (

      <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white transition-colors duration-300">

         <div className="max-w-2xl mx-auto border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-black">

            {/* Header */}

            <div className="sticky top-0 z-10 bg-white/90 dark:bg-black/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 p-4">

               <h1 className="text-2xl font-bold">
                  Notifications
               </h1>

            </div>

            {/* Empty */}

            {
               notifications.length === 0 ? (

                  <div className="flex justify-center items-center h-[80vh] text-zinc-500 dark:text-zinc-400">

                     No notifications

                  </div>

               ) : (

                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800">

                     {
                        notifications.map((notification) => (

                           <div
                              key={notification._id}

                              onClick={() =>
                                 handleNotificationClick(
                                    notification
                                 )
                              }

                              className={`
                                 group
                                 p-4
                                 cursor-pointer
                                 transition-all
                                 duration-200
                                 hover:bg-zinc-100
                                 dark:hover:bg-zinc-900

                                 ${
                                    !notification.isRead
                                       ? "bg-zinc-100 dark:bg-zinc-950"
                                       : ""
                                 }
                              `}
                           >

                              <div className="flex items-start gap-3">

                                 {/* Avatar */}

                                 <div className="w-11 h-11 rounded-full bg-zinc-300 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold uppercase text-black dark:text-white shrink-0">

                                    {
                                       notification.senderId
                                          ?.username?.charAt(0)
                                    }

                                 </div>

                                 {/* Content */}

                                 <div className="flex-1 min-w-0">

                                    <div className="flex items-center justify-between gap-2">

                                       <div className="flex items-center gap-2">

                                          <p className="font-semibold text-sm md:text-base truncate">

                                             {
                                                notification.senderId
                                                   ?.username
                                             }

                                          </p>

                                          {
                                             !notification.isRead && (

                                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />

                                             )
                                          }

                                       </div>

                                       {/* Delete Button */}

                                       <button

                                          onClick={(e)=>{

                                             e.stopPropagation();

                                             handleDeleteNotification(
                                                notification._id
                                             );

                                          }}

                                          className="
                                             opacity-0
                                             group-hover:opacity-100

                                             transition

                                             text-zinc-400
                                             hover:text-red-500

                                             shrink-0
                                          "
                                       >

                                          <Trash2 size={18} />

                                       </button>

                                    </div>

                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 break-words">

                                       {
                                          notification.message
                                       }

                                    </p>

                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">

                                       {
                                          new Date(
                                             notification.createdAt
                                          ).toLocaleString([],{
                                             day:"numeric",
                                             month:"short",
                                             hour:"2-digit",
                                             minute:"2-digit"
                                          })
                                       }

                                    </p>

                                 </div>

                              </div>

                           </div>

                        ))
                     }

                  </div>

               )
            }

         </div>

      </div>

   );

}

export default NotificationPage;