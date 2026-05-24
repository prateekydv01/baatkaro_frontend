import React, { useEffect, useState } from "react";
import { socket } from "../../socket/socket";

import {
  getIncomingRequests,
  acceptRequest,
  rejectRequest,
} from "../../../api/request";

function IncomingRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  const fetchIncomingRequests = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await getIncomingRequests();

      setRequests(res.data.requests);

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch requests"
      );

    } finally {

      setLoading(false);

    }
  };

  const handleAccept = async (requestId) => {

    try {

      setError("");

      await acceptRequest(requestId);

      // remove request instantly from UI
      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Failed to accept request"
      );
    }
  };

  const handleReject = async (requestId) => {

    try {

      setError("");

      await rejectRequest(requestId);

      // remove request instantly from UI
      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Failed to reject request"
      );
    }
  };

  useEffect(() => {

  // new request arrives
  socket.on("newRequest", (request) => {

    setRequests((prev) => [request, ...prev]);

  });

  // sender cancelled request
  socket.on("requestCancelled", (data) => {

   setRequests((prev)=>
      prev.filter(
         (request)=>
            request._id !== data.requestId
      )
   );

});

  return () => {

    socket.off("newRequest");
    socket.off("requestCancelled");

  };

}, []);

  return (

    <div className="w-full max-w-2xl mx-auto px-4 py-8">

      {/* Heading */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm transition-all duration-300">

        <h2 className="text-2xl font-bold text-black dark:text-white">
          Incoming Requests
        </h2>

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
            Loading requests...
          </div>
        )
      }

      {/* Requests */}
      <div className="mt-6 flex flex-col gap-4">

        {
          !loading && requests.length > 0 ? (

            requests.map((request) => (

              <div
                key={request._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-5 py-4 shadow-sm transition-all duration-300"
              >

                {/* User Info */}
                <div className="flex items-center gap-4">

                  <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-lg font-bold text-black dark:text-white uppercase">
                    {request.senderId?.username?.charAt(0)}
                  </div>

                  <div>

                    <p className="font-semibold text-black dark:text-white text-lg">
                      {request.senderId?.username}
                    </p>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {request.senderId?.email}
                    </p>

                  </div>

                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3">

                  <button
                    onClick={() => handleAccept(request._id)}
                    className="px-5 py-2 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-medium transition"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(request._id)}
                    className="px-5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
                  >
                    Reject
                  </button>

                </div>

              </div>
            ))

          ) : (

            !loading && (

              <div className="text-center py-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">

                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                  No incoming requests
                </p>

              </div>

            )

          )
        }

      </div>

    </div>
  );
}

export default IncomingRequests;
