import React, { useEffect, useState } from "react";
import {
  getSentRequests,
  cancelRequest,
} from "../../api/request";

import { socket } from "../../socket/socket";

function SentRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const fetchSentRequests = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await getSentRequests();

      setRequests(res.data.requests || []);

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch sent requests"
      );

    } finally {

      setLoading(false);

    }
  };
  useEffect(() => {

    socket.on("requestAccepted", (request) => {

      setRequests((prev) =>
        prev.filter(
          (r) => r._id !== request.requestId
        )
      );

    });

    socket.on("requestRejected", (request) => {

      setRequests((prev) =>
        prev.filter(
          (r) => r._id !== request.requestId
        )
      );

    });

    socket.on("requestSent", (request) => {

      setRequests((prev) => {

        const exists = prev.some(
          (r) => r._id === request._id
        );

        if (exists) return prev;

        return [request, ...prev];

      });

    });

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

  return () => {

    socket.off("requestAccepted");
    socket.off("requestRejected");
    socket.off("requestSent");
    socket.off("requestCancelled");

  };

}, []);

  const handleCancel = async (requestId) => {

    try {

      setError("");

      await cancelRequest(requestId);

      // remove instantly from UI
      setRequests((prev) =>
        prev.filter(
          (request) => request._id !== requestId
        )
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Failed to cancel request"
      );
    }
  };

  return (

    <div className="w-full max-w-2xl mx-auto px-4 py-8">

      {/* Heading */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm transition-all duration-300">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-black dark:text-white">
            Sent Requests
          </h2>

          <div className="px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium">
            {requests?.length}
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
            Loading requests...
          </div>
        )
      }

      {/* Requests */}
      <div className="mt-6 flex flex-col gap-4">

        {
          !loading && requests?.length > 0 ? (

            requests?.map((request) => (

              <div
                key={request._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-md"
              >

                {/* Receiver Info */}
                <div className="flex items-center gap-4">

                  <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-lg font-bold text-black dark:text-white uppercase">
                    {request.receiverId?.username?.charAt(0)}
                  </div>

                  <div>

                    <p className="font-semibold text-black dark:text-white text-lg">
                      {request.receiverId?.username}
                    </p>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {request.receiverId?.email}
                    </p>

                  </div>

                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3">

                  <div className="px-4 py-2 rounded-2xl bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-medium">
                    Pending
                  </div>

                  <button
                    onClick={() => handleCancel(request._id)}
                    className="px-5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
                  >
                    Cancel
                  </button>

                </div>

              </div>
            ))

          ) : (

            !loading && (

              <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">

                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                  No sent requests
                </p>

              </div>

            )

          )
        }

      </div>

    </div>
  );
}

export default SentRequests;
