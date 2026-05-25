import React,{useEffect,useState} from "react";
import {useSelector} from "react-redux";
import {MessageCircle,Users,ArrowRight,Search} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {getConnections} from "../../../api/request";
import { socket } from "../../socket/socket";

function ContentLoggedIn(){

const navigate=useNavigate();

const {userData}=useSelector((state)=>state.auth);

const [friends,setFriends]=useState([]);

useEffect(()=>{

const fetchFriends=async()=>{

try{

const res=await getConnections();

console.log(res);

setFriends(res?.data?.users||[]);

}catch(error){

console.log(error);

}

};

fetchFriends();

},[]);

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

return(

<div className="min-h-screen bg-zinc-100 dark:bg-black transition-all duration-300 overflow-hidden">

<div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">

<div className="relative overflow-hidden rounded-[40px] border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-3xl p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

<div className="absolute top-0 right-0 h-96 w-96 bg-zinc-200/40 dark:bg-zinc-800/20 blur-3xl rounded-full"></div>

<div className="absolute bottom-0 left-0 h-72 w-72 bg-zinc-300/30 dark:bg-zinc-700/10 blur-3xl rounded-full"></div>

<div className="relative z-10">

<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-500 dark:text-zinc-400 shadow-sm">

<div className="h-2 w-2 rounded-full bg-green-500"></div>

Online

</div>

<h1 className="mt-7 text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-black dark:text-white">

Welcome  
<span>  </span>
<span className="text-zinc-500 dark:text-zinc-400">
  {userData?.username}
</span>

</h1>

<p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
Chat with friends, connect with people and explore real time conversations with a modern experience.
</p>

<div className="mt-10 flex flex-wrap gap-4">

<button className="h-14 px-7 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:scale-[1.03] transition-all duration-200 flex items-center gap-2"
onClick={()=>navigate("/chat")}
>

<MessageCircle size={18}/>

Start Chatting

<ArrowRight size={16}/>

</button>

<button className="h-14 px-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-black dark:text-white text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 flex items-center gap-2"
onClick={()=>navigate("/friends")}
>

<Search size={18}/>

Find Friends

</button>

</div>

</div>

</div>

<div className="mt-8">

<div className="flex items-center justify-between mb-5">

<div>

<h2 className="text-2xl md:text-3xl font-black tracking-tight text-black dark:text-white">
Your Friends
</h2>

<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
Start chatting with your connections
</p>

</div>

<div className="px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-500 dark:text-zinc-400 shadow-sm">
{friends.length} Friends
</div>

</div>

{friends.length===0?(
<div className="h-[220px] rounded-[35px] border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl flex flex-col items-center justify-center text-center">

<div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4">
<Users size={28} className="text-zinc-400"/>
</div>

<h3 className="text-xl font-black text-black dark:text-white">
No friends yet
</h3>

<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
Connect with people to start chatting
</p>

</div>
):(

<div className="flex flex-col gap-4">

{friends.map((friend,index)=>(

<div key={index} className="group flex items-center justify-between gap-4 rounded-[30px] border border-zinc-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">

<div className="flex items-center gap-4 min-w-0">

<div className="relative shrink-0">

<button onClick={()=>{navigate(`/profile/${friend._id}`)}}>
<div className="h-14 w-14 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-lg font-black uppercase shadow-lg">

{friend?.username?.charAt(0)}

</div>
</button>


</div>

<div className="min-w-0">

<h3 className="text-lg font-black text-black dark:text-white truncate">
{friend?.username}
</h3>

<p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
{friend?.email}
</p>

</div>

</div>

<button
onClick={()=>navigate(`/chat/${friend._id}`)}
className="shrink-0 h-11 px-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.03] transition-all duration-200"
>

<MessageCircle size={16}/>

Chat

</button>

</div>

))}

</div>

)}

</div>

</div>

</div>

);

}

export default ContentLoggedIn;