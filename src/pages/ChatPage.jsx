import React, { useState } from "react";

import Navbar from "../components/navbar/Navbar";
import ChatFriendsSideBar from "../components/chat/ChatFriendsSideBar";
import ChatSection from "../components/chat/ChatSection";

function ChatPage() {

  const [selectedFriend, setSelectedFriend] =
    useState(null);

  return (

    <div className="h-screen flex flex-col bg-white dark:bg-black overflow-hidden">

      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <div className="flex flex-1 overflow-hidden ">

        {/* Sidebar */}
        <ChatFriendsSideBar
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
        />

        {/* Chat Section */}
        {
          selectedFriend ? (

            <ChatSection
              friend={selectedFriend}
            />

          ) : (

            <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-black">

              <p className="text-zinc-500 text-lg">

                Select a chat

              </p>

            </div>

          )
        }

      </div>

    </div>

  );

}

export default ChatPage;