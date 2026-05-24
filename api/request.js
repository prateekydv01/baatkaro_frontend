import { api } from "./index.js";

export const sendRequest = (id) =>api.post(`/request/send/${id}`);
export const getIncomingRequests = () => api.get("/request/incoming");
export const acceptRequest = (id) =>api.put(`/request/accept/${id}`);
export const rejectRequest = (id) =>api.put(`/request/reject/${id}`);
export const getConnections = () =>api.get("/request/connections");
export const getSentRequests =
  () => api.get("/request/sent");

export const cancelRequest =
  (id) => api.delete(`/request/cancel/${id}`);

  export const removeFriend = (id)=>
   api.delete(
      `/request/remove-friend/${id}`
   )