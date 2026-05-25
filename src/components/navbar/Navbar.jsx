import React,{useEffect,useState} from "react";
import {useDispatch,useSelector} from "react-redux";
import {logout} from "../../store/authSlice";
import {logoutUser} from "../../../api/auth";
import {useLocation,useNavigate} from "react-router-dom";
import {Menu,X,MessageCircle,Users,Moon,Sun,Bell} from "lucide-react";

function Navbar(){

const dispatch=useDispatch();
const navigate=useNavigate();
const location=useLocation();

const [menuOpen,setMenuOpen]=useState(false);
const [darkMode,setDarkMode]=useState(false);

const {status,userData}=useSelector((state)=>state.auth);
const {notifications}=useSelector((state)=>state.notification);

const unreadCount=notifications.filter((n)=>!n.isRead).length;

useEffect(()=>{

const savedTheme=localStorage.getItem("theme");

if(savedTheme==="dark"){
document.documentElement.classList.add("dark");
setDarkMode(true);
}else{
document.documentElement.classList.remove("dark");
setDarkMode(false);
}

},[]);

const toggleTheme=()=>{

if(darkMode){
document.documentElement.classList.remove("dark");
localStorage.setItem("theme","light");
}else{
document.documentElement.classList.add("dark");
localStorage.setItem("theme","dark");
}

setDarkMode(!darkMode);

};

const handleLogout=async()=>{

try{

await logoutUser();
dispatch(logout());
navigate("/login");

}catch(error){
console.log(error);
}

};

const navBtn=(active)=>`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 border ${active?"bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-lg":"text-black dark:text-white border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 hover:bg-zinc-100 dark:hover:bg-zinc-900"}`;

return(

<nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/75 dark:bg-black/75 backdrop-blur-2xl shadow-sm shadow-black/5 dark:shadow-black/20">

<div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">

<div onClick={()=>navigate("/")} className="flex items-center gap-2 cursor-pointer select-none">

<div className="h-10 w-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black shadow-lg">
BK
</div>

<div className="flex flex-col leading-none -space-y-0.5">

<h1 className="text-[18px] font-black tracking-tight text-black dark:text-white">
BaatKaro
</h1>

<p className="text-[10px] text-zinc-400 font-medium">
Next Gen Chat
</p>

</div>

</div>

<div className="hidden md:flex items-center gap-3">

{status&&(
<>
<button onClick={()=>navigate("/friends")} className={navBtn(location.pathname==="/friends")}>

<div className="flex items-center gap-2">

<Users size={17}/>

Friends

</div>

</button>

<button onClick={()=>navigate("/chat")} className={navBtn(location.pathname==="/chat")}>

<div className="flex items-center gap-2">

<MessageCircle size={17}/>

Chats

</div>

</button>

<button onClick={()=>navigate("/notifications")} className={navBtn(location.pathname==="/notifications")}>

<div className="relative flex items-center gap-2">

<Bell size={17}/>

Notifications

{unreadCount>0&&(
<span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border border-white dark:border-black">
{unreadCount>99?"99+":unreadCount}
</span>
)}

</div>

</button>

</>
)}

<button onClick={toggleTheme} className="h-10 w-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-105">

{darkMode?<Sun size={17}/>:<Moon size={17}/>}

</button>

{status?(
<div className="flex items-center gap-3 ml-2">

<button onClick={()=>navigate("/profile")}>

<div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white flex items-center justify-center font-bold shadow-sm">

{userData?.username?.charAt(0)}

</div>

</button>

<button onClick={handleLogout} className="px-4 py-2 rounded-2xl text-sm font-semibold text-red-500 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/10 hover:bg-red-100 dark:hover:bg-red-950/20 transition-all duration-200">
Logout
</button>

</div>
):(
<div className="flex items-center gap-2">

<button onClick={()=>navigate("/login")} className="px-4 py-2.5 rounded-2xl text-sm font-semibold border border-zinc-200 dark:border-zinc-800 text-black dark:text-white bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-200">
Login
</button>

<button onClick={()=>navigate("/signup")} className="px-4 py-2.5 rounded-2xl text-sm font-semibold bg-black dark:bg-white text-white dark:text-black shadow-lg hover:scale-105 transition-all duration-200">
Sign Up
</button>

</div>
)}

</div>

<div className="md:hidden flex items-center gap-2">

{status&&(
<>

<button
onClick={()=>navigate("/notifications")}
className="relative h-10 w-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center shadow-sm"
>

<Bell size={18}/>

{unreadCount>0&&(
<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border border-white dark:border-black">
{unreadCount>99?"99+":unreadCount}
</span>
)}

</button>

<button
onClick={()=>navigate("/profile")}
className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white flex items-center justify-center font-bold shadow-sm"
>

{userData?.username?.charAt(0)}

</button>

</>
)}

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="h-10 w-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center shadow-sm"
>

{menuOpen?<X size={20}/>:<Menu size={20}/>}

</button>

</div>

</div>

{menuOpen&&(

<div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-2xl px-4 py-4 flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.35)]">

{status?(
<>
<button onClick={()=>{navigate("/friends");setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-black dark:text-white bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-950 transition-all duration-200">

<div className="h-9 w-9 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
<Users size={17}/>
</div>

Friends

</button>

<button onClick={()=>{navigate("/chat");setMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-black dark:text-white bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-950 transition-all duration-200">

<div className="h-9 w-9 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
<MessageCircle size={17}/>
</div>

Chats

</button>

<button onClick={handleLogout} className="px-4 py-3 rounded-2xl text-left text-red-500 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-950/20 transition-all duration-200">
Logout
</button>

</>
):(
<>
<button onClick={()=>navigate("/login")} className="px-4 py-3 rounded-2xl text-left text-black dark:text-white bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200">
Login
</button>

<button onClick={()=>navigate("/signup")} className="px-4 py-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold shadow-lg">
Sign Up
</button>

</>
)}

<button onClick={toggleTheme} className="mt-1 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2 text-black dark:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">

{darkMode?<Sun size={17}/>:<Moon size={17}/>}

Theme

</button>

</div>

)}

</nav>

);

}

export default Navbar;