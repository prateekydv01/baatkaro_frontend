import React from "react";
import {useDispatch,useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import {markNotificationRead} from "../api/notification";
import {markNotificationRead as markRead,removeNotification} from "../store/notificationSlice";
import {deleteNotification} from "../api/notification";
import {Trash2,BellRing} from "lucide-react";

function NotificationPage(){

const dispatch=useDispatch();
const navigate=useNavigate();

const {notifications}=useSelector((state)=>state.notification);

const handleNotificationClick=async(notification)=>{

try{

if(!notification.isRead){

await markNotificationRead(notification._id);

dispatch(markRead(notification._id));

}

if(notification.message==="sent you a message"){

navigate(`/chat/${notification.senderId._id}`);

}else if(notification.message==="sent you a friend request"||notification.message==="accepted your friend request"||notification.message==="rejected your friend request"){

navigate("/friends");

}

}catch(error){

console.log(error);

}

};

const handleDeleteNotification=async(id)=>{

try{

await deleteNotification(id);

dispatch(removeNotification(id));

}catch(error){

console.log(error);

}

};

return(

<div className="min-h-screen bg-zinc-100 dark:bg-black text-black dark:text-white transition-all duration-300">

<Navbar/>

<div className="max-w-3xl mx-auto px-3 md:px-5 pt-5 pb-24">

<div className="flex items-center justify-between mb-6 px-1">

<div className="flex items-center gap-3">

<div className="h-12 w-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg">
<BellRing size={22}/>
</div>

<div>

<h1 className="text-2xl md:text-3xl font-black tracking-tight text-black dark:text-white">
Notifications
</h1>

<p className="text-sm text-zinc-500 dark:text-zinc-400">
Stay updated with your activity
</p>

</div>

</div>

<div className="px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm font-semibold text-zinc-500 dark:text-zinc-400 shadow-sm">
{notifications.length} Alerts
</div>

</div>

{notifications.length===0?(
<div className="flex flex-col items-center justify-center h-[65vh] text-center">

<div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-sm mb-5">
<BellRing size={38} className="text-zinc-400"/>
</div>

<h2 className="text-2xl font-black text-black dark:text-white">
No notifications
</h2>

<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
Your latest activity will appear here
</p>

</div>
):(

<div className="flex flex-col gap-3">

{notifications.map((notification)=>(

<div
key={notification._id}
onClick={()=>handleNotificationClick(notification)}
className={`group relative flex items-start gap-4 p-4 rounded-[28px] border backdrop-blur-xl cursor-pointer transition-all duration-200 hover:scale-[1.01] ${!notification.isRead?"bg-zinc-200/60 dark:bg-zinc-900/80 border-zinc-300 dark:border-zinc-700":"bg-white/70 dark:bg-zinc-950/70 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm"}`}
>

<div className="relative shrink-0">

<div className="h-12 w-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-sm font-black uppercase shadow-md">

{notification.senderId?.username?.charAt(0)}

</div>

{!notification.isRead&&(
<div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-white dark:border-black"></div>
)}

</div>

<div className="flex-1 min-w-0">

<div className="flex items-start justify-between gap-3">

<div className="min-w-0">

<h2 className="text-[15px] font-bold text-black dark:text-white truncate">
{notification.senderId?.username}
</h2>

<p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 break-words leading-relaxed">
{notification.message}
</p>

</div>

<button
onClick={(e)=>{

e.stopPropagation();

handleDeleteNotification(notification._id);

}}
className="opacity-0 group-hover:opacity-100 h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/40 transition-all duration-200 shrink-0"
>

<Trash2 size={16}/>

</button>

</div>

<div className="mt-3 flex items-center justify-between">

<p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">

{new Date(notification.createdAt).toLocaleString([],{
day:"numeric",
month:"short",
hour:"2-digit",
minute:"2-digit"
})}

</p>

{!notification.isRead&&(
<div className="px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-500">
NEW
</div>
)}

</div>

</div>

</div>

))}

</div>

)}

</div>

</div>

);

}

export default NotificationPage;