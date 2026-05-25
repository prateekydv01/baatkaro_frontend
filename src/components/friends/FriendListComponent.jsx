import React, { useEffect, useState } from "react";
import { socket } from "../../socket/socket";
import { getConnections } from "../../api/request";
import { removeFriend } from "../../api/request";
import { useNavigate } from "react-router-dom";

function FriendsList() {

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate=useNavigate()

  const fetchFriends = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await getConnections();
      setFriends(res.data.users);

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch friends"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

    const handleRemove = async (
      friendId
    )=>{

      try{

          await removeFriend(friendId);

          setFriends((prev)=>
            prev.filter(
                (friend)=>
                  friend._id !== friendId
            )
          )

      }catch(error){

          console.log(error)

      }

    }

  useEffect(() => {

  socket.on("friendAdded", (friend) => {

    setFriends((prev) => {

      // avoid duplicates
      const exists = prev.some(
        (f) => f._id === friend._id
      );

      if (exists) return prev;

      return [friend, ...prev];

    });

  });

  socket.on(
    "friendRemoved",
    (data)=>{

        setFriends((prev)=>
          prev.filter(
              (friend)=>
                friend._id !== data.friendId &&
                friend._id !== data.userId
          )
        )

  })

  return () => {

    socket.off("friendAdded");
    socket.off("friendRemoved");

  };

}, []);

  return (

    <div className="w-full max-w-3xl mx-auto px-4 py-8">

      {/* Heading */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm transition-all duration-300">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-black dark:text-white">
            My Friends
          </h2>

          <div className="px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium">
            {friends?.length}
          </div>

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
          <div className="mt-6 text-center text-zinc-600 dark:text-zinc-400 text-lg">
            Loading friends...
          </div>
        )
      }

      {/* Friends List */}
      <div className="mt-6 flex flex-col gap-4">

        {
          !loading && friends.length > 0 ? (

            friends.map((friend) => (

              <div
                key={friend._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-md"
              >

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <button onClick={()=>{navigate(`/profile/${friend._id}`)}}>
                  <div className="h-14 w-14 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xl font-bold text-black dark:text-white uppercase">
                    {friend.username?.charAt(0)}
                  </div>
                  </button>

                  <div>

                    <p className="font-semibold text-black dark:text-white text-lg">
                      {friend.username}
                    </p>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {friend.email}
                    </p>

                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">

                  <button
                    className="px-5 py-2 rounded-2xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium transition"
                    onClick={()=>handleRemove(friend._id)}
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))

          ) : (

            !loading && (

              <div className="text-center py-14 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">

                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                  No friends yet
                </p>

              </div>

            )

          )
        }

      </div>

    </div>
  );
}

export default FriendsList;
