import React,{useEffect,useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import {MessageCircle,Users,UserPlus,Mail,ArrowLeft,ChevronRight} from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import {sendRequest} from "../api/request";
import {getUserProfile} from "../api/auth";
import {socket} from "../socket/socket";

function UserProfilePage(){

const {id}=useParams();

const navigate=useNavigate();

const [user,setUser]=useState(null);
const [friends,setFriends]=useState([]);
const [loading,setLoading]=useState(true);
const [sending,setSending]=useState(false);
const [relationshipStatus,setRelationshipStatus]=useState("none");

const fetchProfile=async()=>{

try{

const res=await getUserProfile(id);

setUser(res?.data?.user);

setFriends(res?.data?.friends||[]);

setRelationshipStatus(
res?.data?.relationshipStatus||"none"
);

}catch(error){

console.log(error);

}finally{

setLoading(false);

}

};

useEffect(()=>{

fetchProfile();

},[id]);

useEffect(()=>{

socket.on("requestSent",(data)=>{

if(data.receiverId===id){

setRelationshipStatus("pending_sent");

}

});

socket.on("requestAccepted",(data)=>{

if(
data.senderId===id||
data.receiverId===id
){

setRelationshipStatus("friend");

fetchProfile();

}

});

socket.on("requestRejected",()=>{

setRelationshipStatus("none");

});

socket.on("requestCancelled",()=>{

setRelationshipStatus("none");

});

socket.on("friendRemoved",(data)=>{

if(
data.friendId===id||
data.userId===id
){

setRelationshipStatus("none");

fetchProfile();

}

});

socket.on("friendAdded",()=>{

fetchProfile();

});

return()=>{

socket.off("requestSent");
socket.off("requestAccepted");
socket.off("requestRejected");
socket.off("requestCancelled");
socket.off("friendRemoved");
socket.off("friendAdded");

};

},[id]);

const handleSendRequest=async()=>{

try{

setSending(true);

await sendRequest(id);

setRelationshipStatus("pending_sent");

}catch(error){

console.log(error);

}finally{

setSending(false);

}

};

if(loading){

return(

<div className="min-h-screen bg-zinc-100 dark:bg-black">

<Navbar/>

<div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

<div className="h-[300px] rounded-[30px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center text-lg font-bold text-zinc-500 dark:text-zinc-400">
Loading Profile...
</div>

</div>

</div>

);

}

return(

<div className="min-h-screen bg-zinc-100 dark:bg-black transition-all duration-300 overflow-hidden">

<Navbar/>

<div className="max-w-7xl mx-auto px-0 md:px-6 pb-24 md:py-10">

{/* MOBILE */}

<div className="md:hidden">

<div className="relative bg-white dark:bg-zinc-950 rounded-b-[34px] overflow-hidden px-5 pt-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">

<div className="absolute top-0 right-0 h-52 w-52 bg-zinc-200/40 dark:bg-white/10 blur-3xl rounded-full"></div>

<div className="absolute bottom-0 left-0 h-40 w-40 bg-zinc-300/20 dark:bg-white/5 blur-3xl rounded-full"></div>

<div className="relative z-10">

<button
onClick={()=>navigate(-1)}
className="mb-5 h-10 px-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-black dark:text-white text-sm font-bold flex items-center gap-2"
>

<ArrowLeft size={15}/>

Back

</button>

<div className="flex items-center gap-4">

<div className="h-20 w-20 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-3xl font-black shadow-lg shrink-0">

{user?.username?.charAt(0)}

</div>

<div className="min-w-0 flex-1">

<p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
Profile
</p>

<h1 className="mt-1 text-[28px] leading-none font-black text-black dark:text-white tracking-tight truncate">
{user?.username}
</h1>

<div className="mt-3 flex items-center gap-2">

<div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0">
<Mail size={15} className="text-zinc-600 dark:text-zinc-300"/>
</div>

<p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
{user?.email}
</p>

</div>

</div>

</div>

<div className="mt-5 rounded-[22px] bg-zinc-50 dark:bg-white/10 border border-zinc-200 dark:border-white/10 px-4 py-4 flex items-center justify-between">

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

<div className="mt-5">

{relationshipStatus==="friend"&&(
<div className="flex gap-2">
<button
onClick={()=>navigate(`/chat/${user?._id}`)}
className="flex-1 h-11 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
>
<MessageCircle size={15}/>
Chat
</button>

<button
disabled
className="px-5 h-11 rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-sm font-bold"
>
Friends
</button>
</div>
)}

{relationshipStatus==="pending_sent"&&(
<button
disabled
className="w-full h-11 rounded-2xl border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 text-sm font-bold"
>
Request Sent
</button>
)}

{relationshipStatus==="pending_received"&&(
<button
onClick={()=>navigate("/friends")}
className="w-full h-11 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold"
>
Respond Request
</button>
)}

{relationshipStatus==="none"&&(
<button
onClick={handleSendRequest}
disabled={sending}
className="w-full h-11 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-black dark:bg-white text-white dark:text-black text-sm font-bold flex items-center justify-center gap-2"
>
<UserPlus size={16}/>
{sending?"Sending...":"Connect"}
</button>
)}

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
Connected people
</p>

</div>

<div className="h-10 px-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-sm font-bold text-zinc-500 dark:text-zinc-400 shadow-sm">
{friends.length}
</div>

</div>

<div className="flex flex-col gap-3">

{friends.map((friend,index)=>(

<div key={index} className="rounded-[24px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 shadow-sm">

<div className="flex items-center gap-3">

<div
onClick={()=>navigate(`/profile/${friend._id}`)}
className="h-14 w-14 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-lg font-black uppercase shadow-lg shrink-0 cursor-pointer"
>

{friend?.username?.charAt(0)}

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

</div>

</div>

{/* DESKTOP */}

<div className="hidden md:block">

<div className="px-6 py-8">

<button
onClick={()=>navigate(-1)}
className="mb-5 h-12 px-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white text-sm font-bold flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
>

<ArrowLeft size={17}/>

Back

</button>

<div className="relative overflow-hidden rounded-[40px] border border-zinc-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

<div className="absolute top-0 right-0 h-96 w-96 bg-zinc-200/40 dark:bg-zinc-800/20 blur-3xl rounded-full"></div>

<div className="relative z-10 flex items-center justify-between gap-8">

<div className="flex items-center gap-5">

<div className="h-28 w-28 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-4xl font-black uppercase shadow-[0_15px_40px_rgba(0,0,0,0.2)]">

{user?.username?.charAt(0)}

</div>

<div>

<h1 className="text-5xl font-black tracking-tight text-black dark:text-white">
{user?.username}
</h1>

<div className="mt-5 flex items-center gap-3 text-zinc-500 dark:text-zinc-400">

<div className="h-10 w-10 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
<Mail size={18}/>
</div>

<p className="text-base font-medium break-all">
{user?.email}
</p>

</div>

<div className="mt-6 flex flex-wrap gap-3">

{relationshipStatus==="friend"&&(
<>
<button
onClick={()=>navigate(`/chat/${user?._id}`)}
className="h-12 px-6 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
>
<MessageCircle size={17}/>
Chat
</button>

<button
disabled
className="h-12 px-6 rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-sm font-bold"
>
Friends
</button>
</>
)}

{relationshipStatus==="pending_sent"&&(
<button
disabled
className="h-12 px-6 rounded-2xl border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 text-sm font-bold"
>
Request Sent
</button>
)}

{relationshipStatus==="pending_received"&&(
<button
onClick={()=>navigate("/friends")}
className="h-12 px-6 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold"
>
Respond Request
</button>
)}

{relationshipStatus==="none"&&(
<button
onClick={handleSendRequest}
disabled={sending}
className="h-12 px-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white text-sm font-bold flex items-center justify-center gap-2"
>
<UserPlus size={17}/>
{sending?"Sending...":"Connect"}
</button>
)}

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
Friends
</h2>

<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
People connected with {user?.username}
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

<button
onClick={()=>navigate(`/profile/${friend._id}`)}
className="h-11 px-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center gap-2"
>

View Profile

</button>

</div>

</div>

))}

</div>

</div>

</div>

</div>

</div>

</div>
);

}

export default UserProfilePage;