import React, { useState } from "react";

import Navbar from "../components/navbar/Navbar";
import ChatFriendsSideBar from "../components/chat/ChatFriendsSideBar";
import ChatSection from "../components/chat/ChatSection";

function ChatPage() {

   const [selectedFriend, setSelectedFriend] =
      useState(null);

   return (

      <div className="h-[100dvh] bg-white dark:bg-black flex flex-col overflow-hidden">

         {/* Navbar */}
         <div className="shrink-0">
            <Navbar />
         </div>

         {/* Main */}
         <div className="flex-1 flex overflow-hidden relative">

            {/* Sidebar */}
            <div
               className={`
                  ${selectedFriend ? "hidden md:flex" : "flex"}
                  w-full md:w-[350px]
                  h-full
               `}
            >

               <ChatFriendsSideBar
                  selectedFriend={selectedFriend}
                  setSelectedFriend={setSelectedFriend}
               />

            </div>

            {/* Chat Section */}
            <div
               className={`
                  ${selectedFriend ? "flex" : "hidden md:flex"}
                  flex-1
                  h-full
               `}
            >

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