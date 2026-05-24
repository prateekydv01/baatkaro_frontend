// ChatFriendsSideBar.jsx

import React,{useState,useEffect} from "react";
import { getConnections } from "../../../api/request";
import { socket } from "../../socket/socket";

function ChatFriendsSideBar({selectedFriend,setSelectedFriend}) {

   const [friends,setFriends]=useState([]);
   const [loading,setLoading]=useState(false);
   const [error,setError]=useState("");
   const [typingUsers,setTypingUsers]=useState([]);

   const formatMessageTime=(time)=>{

      if(!time) return "";

      const date=new Date(time);
      const now=new Date();

      const isToday=
         date.toDateString()===
         now.toDateString();

      const yesterday=new Date();

      yesterday.setDate(
         yesterday.getDate()-1
      );

      const isYesterday=
         date.toDateString()===
         yesterday.toDateString();

      if(isToday){

         return date.toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit"
         });

      }

      if(isYesterday){
         return "Yesterday";
      }

      return date.toLocaleDateString([],{
         day:"numeric",
         month:"short"
      });

   };

   const fetchFriends=async()=>{

      try{

         setLoading(true);
         setError("");

         const res=
            await getConnections();

         setFriends(res.data.users);

      }catch(error){

         console.log(error);

         setError(
            error.response?.data?.message ||
            "Failed to fetch friends"
         );

      }finally{

         setLoading(false);

      }

   };

   useEffect(()=>{
      fetchFriends();
   },[]);

   useEffect(()=>{

      socket.on("friendAdded",async()=>{

         try{

            const res=
               await getConnections();

            setFriends(res.data.users);

         }catch(error){

            console.log(error);

         }

      });

      socket.on("friendRemoved",(data)=>{

         setFriends((prev)=>
            prev.filter(
               (friend)=>
                  friend._id!==data.friendId &&
                  friend._id!==data.userId
            )
         );

      });

      socket.on("receiveMessage",async()=>{

         try{

            const res=
               await getConnections();

            setFriends(res.data.users);

         }catch(error){

            console.log(error);

         }

      });

      socket.on("typing",(senderId)=>{

         setTypingUsers((prev)=>{

            if(prev.includes(senderId)){
               return prev;
            }

            return [...prev,senderId];

         });

      });

      socket.on("stop-typing",(senderId)=>{

         setTypingUsers((prev)=>
            prev.filter((id)=>id!==senderId)
         );

      });

      return ()=>{

         socket.off("friendAdded");
         socket.off("friendRemoved");
         socket.off("receiveMessage");
         socket.off("typing");
         socket.off("stop-typing");

      };

   },[]);

   return (
      <div className="w-full md:w-[350px] h-full bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 flex flex-col">

         <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-2xl font-bold text-black dark:text-white">Chats</h1>
            <p className="text-sm text-zinc-500 mt-1">Your Connections</p>
         </div>

         {loading&&(
            <div className="flex-1 flex items-center justify-center">
               <p className="text-zinc-500">Loading...</p>
            </div>
         )}

         {error&&(
            <div className="p-4">
               <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-xl p-3 text-sm">
                  {error}
               </div>
            </div>
         )}

         {!loading&&!error&&(
            <div className="flex-1 overflow-y-auto p-2 space-y-2">

               {friends.length===0?(
                  <div className="h-full flex items-center justify-center">
                     <p className="text-zinc-500">No Friends Found</p>
                  </div>
               ):(
                  friends.map((friend)=>(
                     <div
                        key={friend._id}
                        onClick={()=>setSelectedFriend(friend)}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                           selectedFriend?._id===friend._id
                              ?"bg-zinc-200 dark:bg-zinc-800"
                              :"hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        }`}
                     >

                        <div className="w-12 h-12 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-lg font-semibold text-black dark:text-white uppercase">
                           {friend.username?.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0">

                           <div className="flex items-center justify-between gap-2">

                              <h2 className="font-semibold text-black dark:text-white truncate">
                                 {friend.username}
                              </h2>

                              {friend.lastMessageTime&&(
                                 <span className="text-xs text-zinc-500 shrink-0">
                                    {formatMessageTime(friend.lastMessageTime)}
                                 </span>
                              )}

                           </div>

                           <p className="text-sm text-zinc-500 truncate">
                              {
                                 typingUsers.includes(friend._id)
                                    ?"Typing..."
                                    :(friend.lastMessage || "Start chatting...")
                              }
                           </p>

                        </div>

                     </div>
                  ))
               )}

            </div>
         )}

      </div>
   );

}

export default ChatFriendsSideBar;