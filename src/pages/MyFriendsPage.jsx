import React from "react";

import Navbar from "../components/navbar/Navbar";

import SearchFriend from "../components/friends/SearchFriend";
import IncomingRequests from "../components/friends/IncomingRequest";
import FriendsList from "../components/friends/FriendListComponent";
import SentRequests from "../components/friends/SentRequest";

function MyFriendsPage() {

  return (

    <div
      className="
        min-h-screen

        bg-zinc-100
        dark:bg-black

        transition-colors
        duration-300
      "
    >

      {/* Navbar */}
      <Navbar />

      {/* Page Wrapper */}
      <div
        className="
          max-w-7xl
          mx-auto

          px-4
          sm:px-6
          lg:px-8

          py-8
        "
      >

        {/* Heading */}
        <div className="mb-8">

          <h1
            className="
              text-4xl
              font-bold

              text-black
              dark:text-white
            "
          >
            Friends
          </h1>

          <p
            className="
              mt-2

              text-zinc-600
              dark:text-zinc-400
            "
          >
            Manage your connections, requests and friends.
          </p>

        </div>

        {/* Main Grid */}
        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2

            gap-8
          "
        >

          {/* Left Section */}
          <div className="flex flex-col gap-8">

            <SearchFriend />

            <IncomingRequests />

          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-8">

            <SentRequests />

            <FriendsList />

          </div>

        </div>

      </div>

    </div>
  );
}

export default MyFriendsPage;