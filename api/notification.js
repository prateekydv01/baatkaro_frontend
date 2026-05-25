import {api} from "./index"

export const getNotifications =  ()=>api.get('/notifications')
export const markNotificationRead =(id) => api.put(`/notifications/${id}`);
export const deleteNotification = (id)=>api.delete(`/notifications/${id}`);