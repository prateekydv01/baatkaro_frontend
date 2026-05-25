import React,{useEffect,useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {MessageCircle,Users,User,Mail,ChevronRight} from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import {getConnections,removeFriend} from "../api/request";
import {socket} from "../socket/socket";

function ProfilePage(){

const navigate=useNavigate();

const {userData}=useSelector((state)=>state.auth);

const [friends,setFriends]=useState([]);
const [loading,setLoading]=useState(true);

useEffect(()=>{

const fetchFriends=async()=>{

try{

const res=await getConnections();

setFriends(res?.data?.users||[]);

}catch(error){

console.log(error);

}finally{

setLoading(false);

}

};

fetchFriends();

},[]);

const handleRemoveFriend=async(friendId)=>{

try{

await removeFriend(friendId);

setFriends((prev)=>prev.filter((friend)=>friend._id!==friendId));

}catch(error){

console.log(error);

}

};

useEffect(()=>{

socket.on("friendAdded",(friend)=>{

setFriends((prev)=>{

const exists=prev.some((f)=>f._id===friend._id);

if(exists)return prev;

return [friend,...prev];

});

});

socket.on("friendRemoved",(data)=>{

setFriends((prev)=>
prev.filter(
(friend)=>
friend._id!==data.friendId &&
friend._id!==data.userId
)
);

});

return()=>{

socket.off("friendAdded");

socket.off("friendRemoved");

};

},[]);

return(

<div className="min-h-screen bg-zinc-100 dark:bg-black overflow-hidden transition-all duration-300">

<Navbar/>

<div className="max-w-6xl mx-auto px-0 md:px-6 pb-24 md:py-8">

{/* MOBILE */}

<div className="md:hidden">

<div className="relative bg-white dark:bg-zinc-950 rounded-b-[34px] overflow-hidden px-5 pt-7 pb-6 border-b border-zinc-200 dark:border-zinc-800">

<div className="absolute top-0 right-0 h-52 w-52 bg-zinc-200/40 dark:bg-white/10 blur-3xl rounded-full"></div>

<div className="absolute bottom-0 left-0 h-40 w-40 bg-zinc-300/20 dark:bg-white/5 blur-3xl rounded-full"></div>

<div className="relative z-10">

<div className="flex items-center gap-4">

<button
onClick={()=>navigate("/profile")}
className="shrink-0"
>

<div className="h-20 w-20 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-3xl font-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]">

{userData?.username?.charAt(0)}

</div>

</button>

<div className="min-w-0 flex-1">

<p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
My Profile
</p>

<h1 className="mt-1 text-[28px] leading-none font-black text-black dark:text-white tracking-tight truncate">
{userData?.username}
</h1>

<div className="mt-3 flex items-center gap-2">

<div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0">
<Mail size={15} className="text-zinc-600 dark:text-zinc-300"/>
</div>

<p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
{userData?.email}
</p>

</div>

</div>

</div>

<div className="mt-5">

<div className="rounded-[22px] bg-zinc-50 dark:bg-white/10 border border-zinc-200 dark:border-white/10 px-4 py-4 flex items-center justify-between">

<div>

<p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
Friends
</p>

<h2 className="mt-1 text-3xl font-black text-black dark:text-white">
{friends.length}
</h2>

</div>

<div className="h-12 w-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg">
<Users size={20}/>
</div>

</div>

</div>

</div>

</div>

<div className="px-4 mt-5">

<div className="flex items-center justify-between mb-4">

<div>

<h2 className="text-2xl font-black text-black dark:text-white tracking-tight">
Friends
</h2>

<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
Your connections
</p>

</div>

<div className="h-10 px-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-sm font-bold text-zinc-500 dark:text-zinc-400 shadow-sm">
{friends.length}
</div>

</div>

{loading?(
<div className="h-[180px] rounded-[28px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-bold">
Loading...
</div>
):friends.length===0?(
<div className="h-[200px] rounded-[28px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">

<div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
<Users size={28} className="text-zinc-400"/>
</div>

<h3 className="text-xl font-black text-black dark:text-white">
No friends yet
</h3>

<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
Start connecting with people
</p>

</div>
):(

<div className="flex flex-col gap-3">

{friends.map((friend,index)=>(

<div key={index} className="rounded-[24px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 shadow-sm">

<div className="flex items-center gap-3">

<div
onClick={()=>navigate(`/profile/${friend._id}`)}
className="relative shrink-0 cursor-pointer"
>

<div className="h-14 w-14 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-lg font-black uppercase shadow-lg">

{friend?.username?.charAt(0)}

</div>

</div>

<div
onClick={()=>navigate(`/profile/${friend._id}`)}
className="flex-1 min-w-0 cursor-pointer"
>

<h3 className="text-[15px] font-black text-black dark:text-white truncate">
{friend?.username}
</h3>

<p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1">
{friend?.email}
</p>

<div className="flex items-center gap-2 mt-3">

<button
onClick={()=>navigate(`/chat/${friend._id}`)}
className="h-9 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
>

<MessageCircle size={14}/>

Chat

</button>

<button
onClick={()=>handleRemoveFriend(friend._id)}
className="h-9 px-4 rounded-xl border border-red-500/20 dark:border-red-500/20 bg-red-500/[0.06] dark:bg-red-500/[0.08] text-red-500 dark:text-red-400 text-xs font-bold flex items-center justify-center"
>

Remove

</button>

</div>

</div>

<button
onClick={()=>navigate(`/profile/${friend._id}`)}
className="h-10 w-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0"
>

<ChevronRight size={18}/>

</button>

</div>

</div>

))}

</div>

)}

</div>

</div>

{/* DESKTOP */}

<div className="hidden md:block px-6 py-8">

<div className="relative overflow-hidden rounded-[40px] border border-zinc-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

<div className="absolute top-0 right-0 h-96 w-96 bg-zinc-200/40 dark:bg-zinc-800/20 blur-3xl rounded-full"></div>

<div className="relative z-10 flex items-center justify-between">

<div className="flex items-center gap-5">

<button
onClick={()=>navigate("/profile")}
className="group"
>

<div className="h-28 w-28 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-4xl font-black uppercase shadow-[0_15px_40px_rgba(0,0,0,0.2)] group-hover:scale-[1.03] transition-all duration-200">

{userData?.username?.charAt(0)}

</div>

</button>

<div>

<h1 className="text-5xl font-black tracking-tight text-black dark:text-white">
{userData?.username}
</h1>

<div className="mt-5 flex items-center gap-3 text-zinc-500 dark:text-zinc-400">

<div className="h-10 w-10 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
<Mail size={18}/>
</div>

<p className="text-base font-medium break-all">
{userData?.email}
</p>

</div>

</div>

</div>

<div className="h-28 w-[170px] rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl flex items-center justify-between px-5 shadow-lg">

<div>

<p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
Friends
</p>

<h2 className="mt-1 text-3xl font-black text-black dark:text-white">
{friends.length}
</h2>

</div>

<div className="h-12 w-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg">
<Users size={20}/>
</div>

</div>

</div>

</div>

<div className="mt-8">

<div className="flex items-center justify-between mb-5">

<div>

<h2 className="text-3xl font-black tracking-tight text-black dark:text-white">
Friends List
</h2>

<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
Manage your connections
</p>

</div>

</div>

<div className="flex flex-col gap-4">

{friends.map((friend,index)=>(

<div key={index} className="rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl px-5 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">

<div className="flex items-center justify-between gap-3">

<div className="flex items-center gap-4 min-w-0">

<div className="h-16 w-16 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xl font-black uppercase shadow-lg">

{friend?.username?.charAt(0)}

</div>

<div className="min-w-0">

<h3 className="text-lg font-black text-black dark:text-white truncate">
{friend?.username}
</h3>

<p className="text-sm text-zinc-500 dark:text-zinc-400 truncate mt-1">
{friend?.email}
</p>

</div>

</div>

<div className="flex items-center gap-3">

<button
onClick={()=>navigate(`/profile/${friend._id}`)}
className="h-11 px-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center gap-2"
>

<User size={15}/>

Profile

</button>

<button
onClick={()=>navigate(`/chat/${friend._id}`)}
className="h-11 px-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
>

<MessageCircle size={15}/>

Chat

</button>

<button
onClick={()=>handleRemoveFriend(friend._id)}
className="h-11 px-5 rounded-2xl border border-red-500/20 dark:border-red-500/20 bg-red-500/[0.06] dark:bg-red-500/[0.08] text-red-500 dark:text-red-400 text-sm font-bold hover:bg-red-500/15 dark:hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center"
>

Remove

</button>

</div>

</div>

</div>

))}

</div>

</div>

</div>

</div>

</div>

);

}

export default ProfilePage;