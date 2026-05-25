import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";
import ChatFriendsSideBar from "../components/chat/ChatFriendsSideBar";
import ChatSection from "../components/chat/ChatSection";

import { getConnections } from "../api/request";

function ChatPage() {

   const { id } = useParams();

   const [selectedFriend, setSelectedFriend] = useState(null);

   useEffect(()=>{

      const fetchFriend = async()=>{

         try{

            const res = await getConnections();

            const friend = res.data.users.find(
               (u)=>u._id === id
            );

            setSelectedFriend(friend || null);

         }catch(error){

            console.log(error);

         }

      };

      if(id){
         fetchFriend();
      }else{
         setSelectedFriend(null);
      }

   },[id]);

   return (

      <div className="h-[100dvh] bg-white dark:bg-black flex flex-col overflow-hidden">

         <div className="shrink-0">
            <Navbar />
         </div>

         <div className="flex-1 flex overflow-hidden relative">

            <div className={`${selectedFriend ? "hidden md:flex" : "flex"} w-full md:w-[350px] h-full`}>

               <ChatFriendsSideBar
                  selectedFriend={selectedFriend}
                  setSelectedFriend={setSelectedFriend}
               />

            </div>

            <div className={`${selectedFriend ? "flex" : "hidden md:flex"} flex-1 h-full`}>

               {
                  selectedFriend ? (

                     <ChatSection
                        friend={selectedFriend}
                        setSelectedFriend={setSelectedFriend}
                     />

                  ) : (

                     <div className="flex-1 hidden md:flex items-center justify-center bg-zinc-50 dark:bg-black">

                        <p className="text-zinc-500 text-lg">
                           Select a chat
                        </p>

                     </div>

                  )
               }

            </div>

         </div>

      </div>

   );

}

export default ChatPage;