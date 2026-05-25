import React, { useEffect, useState } from "react";
import { socket } from "../../socket/socket";
import { searchUsers } from "../../api/auth";
import { sendRequest } from "../../api/request";

function SearchFriend() {

  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // auto search while typing
  useEffect(() => {

    const delaySearch = setTimeout(() => {

      if (username.trim()) {
        search();
      } else {
        setUsers([]);
      }

    }, 400);

    return () => clearTimeout(delaySearch);

  }, [username]);

  const search = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await searchUsers(username);

      setUsers(res.data.users);

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message || "Failed to search users"
      );

    } finally {

      setLoading(false);

    }
  };

  const sendFriendRequest = async (userId) => {

    try {

      setError("");

      await sendRequest(userId);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, requestStatus: "pending" }
            : user
        )
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {

  // request accepted
  socket.on("requestAccepted", (request) => {

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === request.receiverId
          ? { ...user, requestStatus: "accepted" }
          : user
      )
    );

  });

  // request rejected
  socket.on("requestRejected", (request) => {

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === request.receiverId
          ? { ...user, requestStatus: null }
          : user
      )
    );

  });

  // request cancelled
  socket.on("requestCancelled", (data) => {
      setUsers((prevUsers)=>
          prevUsers.map((user)=>
            user._id === data.receiverId ||
            user._id === data.senderId
            ? {...user,requestStatus:null}
            : user
          )
      );

    });

    socket.on(
   "friendRemoved",
   (data)=>{

      setUsers((prevUsers)=>
         prevUsers.map((user)=>
            user._id === data.friendId ||
            user._id === data.userId
            ? {
               ...user,
               requestStatus:null
            }
            : user
         )
      )

})
  return () => {

    socket.off("requestAccepted");
    socket.off("requestRejected");
    socket.off("requestCancelled");
    socket.off("FriendRemoved");

  };

}, []);

  return (

    <div className="w-full max-w-2xl mx-auto px-4 py-8">

      {/* Search Box */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm transition-all duration-300">

        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
          Search Friends
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 rounded-2xl px-5 py-4 outline-none border
            bg-white border-zinc-300 text-black
            focus:border-black
            dark:bg-zinc-800 dark:border-zinc-700 dark:text-white
            dark:focus:border-white transition"
          />

        </div>

      </div>

      {/* Error */}
      {
        error && (
          <div className="mt-4 rounded-2xl border border-red-300 bg-red-100 dark:bg-red-950/40 dark:border-red-900 px-4 py-3 text-red-700 dark:text-red-300">
            {error}
          </div>
        )
      }

      {/* Loading */}
      {
        loading && (
          <div className="mt-6 text-center text-zinc-600 dark:text-zinc-400">
            Searching...
          </div>
        )
      }

      {/* Users */}
      <div className="mt-6 flex flex-col gap-4">

        {
          !loading && users.length > 0 ? (

            users.map((user) => (

              <div
                key={user._id}
                className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-5 py-4 shadow-sm transition-all duration-300"
              >

                <div className="flex items-center gap-4">

                  <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-lg font-bold text-black dark:text-white uppercase">
                    {user.username?.charAt(0)}
                  </div>

                  <div>
                    <p className="font-semibold text-black dark:text-white text-lg">
                      {user.username}
                    </p>
                  </div>

                </div>

                {
                  user.requestStatus === "pending" ? (

                    <button
                      disabled
                      className="px-5 py-2 rounded-2xl bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-medium cursor-not-allowed"
                    >
                      Pending
                    </button>

                  ) : user.requestStatus === "received" ? (

                    <button
                      className="px-5 py-2 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-medium transition"
                    >
                      Accept
                    </button>

                  ) : user.requestStatus === "accepted" ? (

                    <button
                      disabled
                      className="px-5 py-2 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium cursor-not-allowed"
                    >
                      Friends
                    </button>

                  ) : (

                    <button
                      onClick={() => sendFriendRequest(user._id)}
                      className="px-5 py-2 rounded-2xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium transition"
                    >
                      Add Friend
                    </button>

                  )
                }

              </div>
            ))

          ) : (

            !loading && username.trim() && (

              <div className="text-center py-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">

                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                  No user found
                </p>

              </div>
            )

          )
        }

      </div>

    </div>
  );
}

export default SearchFriend;
