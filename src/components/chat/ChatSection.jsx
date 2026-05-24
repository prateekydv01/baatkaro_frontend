// ChatSection.jsx

import React,{useState,useEffect,useRef} from "react";
import { sendMessage,getMessages,deleteMessage } from "../../../api/chat";
import { useSelector } from "react-redux";
import { socket } from "../../socket/socket";

function ChatSection({friend}) {

   const user=
      useSelector(
         (state)=>state.auth.userData
      );

   const [messages,setMessages]=useState([]);
   const [text,setText]=useState("");
   const [loading,setLoading]=useState(false);
   const [isOnline,setIsOnline]=useState(false);
   const [lastSeen,setLastSeen]=useState(friend?.lastSeen);
   const [isTyping,setIsTyping]=useState(false);

   const messagesEndRef=
      useRef();

   const formatLastSeen=(lastSeen)=>{

      if(!lastSeen)
         return "Recently";

      const date=
         new Date(lastSeen);

      const now=
         new Date();

      const isToday=
         date.toDateString()===
         now.toDateString();

      const yesterday=
         new Date();

      yesterday.setDate(
         yesterday.getDate()-1
      );

      const isYesterday=
         date.toDateString()===
         yesterday.toDateString();

      if(isToday){

         return date.toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit"
         });

      }

      if(isYesterday){
         return "Yesterday";
      }

      return date.toLocaleDateString([],{
         day:"numeric",
         month:"short"
      });

   };

   useEffect(()=>{

      if(friend?._id){
         fetchMessages();
      }

      setLastSeen(friend?.lastSeen);

   },[friend]);

   useEffect(()=>{

      socket.emit(
         "get-online-users"
      );

      socket.on("online-users",(users)=>{

         setIsOnline(
            users.includes(friend?._id)
         );

      });

      socket.on("user-online",(userId)=>{

         if(userId===friend?._id){
            setIsOnline(true);
         }

      });

      socket.on("user-offline",(data)=>{

         if(data.userId===friend?._id){

            setIsOnline(false);

            setLastSeen(
               data.lastSeen
            );

         }

      });

      socket.on("typing",(senderId)=>{

         if(
            senderId.toString()===
            friend?._id.toString()
         ){

            setIsTyping(true);

         }

      });

      socket.on("stop-typing",(senderId)=>{

         if(
            senderId.toString()===
            friend?._id.toString()
         ){

            setIsTyping(false);

         }

      });

      socket.on("receiveMessage",(message)=>{

         if(
            (
               message.senderId?._id===
                  friend?._id &&
               message.receiverId?._id===
                  user?._id
            ) ||
            (
               message.receiverId?._id===
                  friend?._id &&
               message.senderId?._id===
                  user?._id
            )
         ){

            setMessages((prev)=>{

               const exists=
                  prev.some(
                     (msg)=>
                        msg._id===
                        message._id
                  );

               if(exists)
                  return prev;

               return [
                  ...prev,
                  message
               ];

            });

         }

      });

      socket.on("messageDeleted",(data)=>{

         setMessages((prev)=>
            prev.filter(
               (msg)=>
                  msg._id!==
                  data.messageId
            )
         );

      });

      return ()=>{

         socket.off("online-users");
         socket.off("user-online");
         socket.off("user-offline");
         socket.off("typing");
         socket.off("stop-typing");
         socket.off("receiveMessage");
         socket.off("messageDeleted");

      };

   },[friend,user]);

   useEffect(()=>{

      messagesEndRef.current?.scrollIntoView({
         behavior:"smooth"
      });

   },[messages]);

   const fetchMessages=
      async()=>{

         try{

            setLoading(true);

            const res=
               await getMessages(
                  friend._id
               );

            setMessages(
               res.data.messages
            );

         }catch(error){

            console.log(error);

         }finally{

            setLoading(false);

         }

      };

   let typingTimeout;

   const handleTyping=(value)=>{

      setText(value);

      socket.emit("typing",{
         senderId:user._id,
         receiverId:friend._id
      });

      clearTimeout(
         typingTimeout
      );

      typingTimeout=
         setTimeout(()=>{

            socket.emit(
               "stop-typing",
               {
                  senderId:user._id,
                  receiverId:friend._id
               }
            );

         },1000);

   };

   const handleSendMessage=
      async()=>{

         if(
            !text.trim() ||
            !friend?._id
         ) return;

         try{

            const messageText=
               text;

            setText("");

            socket.emit(
               "stop-typing",
               {
                  senderId:user._id,
                  receiverId:friend._id
               }
            );

            await sendMessage(
               friend._id,
               {
                  text:messageText
               }
            );

         }catch(error){

            console.log(error);

         }

      };

   const handleDeleteMessage=
      async(messageId)=>{

         try{

            await deleteMessage(
               messageId
            );

            setMessages((prev)=>
               prev.filter(
                  (msg)=>
                     msg._id!==messageId
               )
            );

         }catch(error){

            console.log(error);

         }

      };

   return (
      <div className="flex flex-col flex-1 h-full overflow-hidden bg-zinc-50 dark:bg-black">

         <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex items-center gap-4 shadow-sm">

            <div className="h-12 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-lg font-bold uppercase text-black dark:text-white">
               {friend?.username?.charAt(0)}
            </div>

            <div>

               <h2 className="text-lg font-semibold text-black dark:text-white">
                  {friend?.username}
               </h2>

               <p className={`text-sm ${
                  isTyping
                     ?"text-blue-500"
                     :(
                        isOnline
                           ?"text-green-500"
                           :"text-zinc-500"
                     )
               }`}>

                  {
                     isTyping
                        ?"Typing..."
                        :(
                           isOnline
                              ?"Online"
                              :`Last seen ${formatLastSeen(lastSeen)}`
                        )
                  }

               </p>

            </div>

         </div>

         <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">

            {
               loading ? (
                  <div className="flex-1 flex items-center justify-center">
                     <p className="text-zinc-500">
                        Loading messages...
                     </p>
                  </div>
               ) : (
                  messages.map((message)=>{

                     const isSender=
                        message.senderId?._id===
                        user?._id;

                     return (
                        <div
                           key={message._id}
                           className={`flex ${
                              isSender
                                 ?"justify-end"
                                 :"justify-start"
                           }`}
                        >

                           <div className="group flex flex-col max-w-[75%]">

                              <div className={`px-4 py-3 rounded-3xl text-sm shadow-sm break-words ${
                                 isSender
                                    ?"bg-black text-white dark:bg-white dark:text-black rounded-br-md"
                                    :"bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white rounded-bl-md"
                              }`}>

                                 {message.text}

                              </div>

                              <div className={`flex items-center gap-2 mt-1 px-1 text-xs text-zinc-500 ${
                                 isSender
                                    ?"justify-end"
                                    :"justify-start"
                              }`}>

                                 <span>
                                    {
                                       new Date(
                                          message.createdAt
                                       ).toLocaleTimeString([],{
                                          hour:"2-digit",
                                          minute:"2-digit"
                                       })
                                    }
                                 </span>

                                 {
                                    isSender&&(
                                       <button
                                          onClick={()=>
                                             handleDeleteMessage(
                                                message._id
                                             )
                                          }
                                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition"
                                       >
                                          Delete
                                       </button>
                                    )
                                 }

                              </div>

                           </div>

                        </div>
                     );

                  })
               )
            }

            <div ref={messagesEndRef} />

         </div>

         <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex items-center gap-3">

            <input
               type="text"
               placeholder="Type a message..."
               value={text}
               onChange={(e)=>
                  handleTyping(
                     e.target.value
                  )
               }
               onKeyDown={(e)=>{

                  if(e.key==="Enter"){
                     handleSendMessage();
                  }

               }}
               className="flex-1 rounded-2xl px-5 py-3 border border-zinc-300 bg-white text-black outline-none dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
            />

            <button
               onClick={handleSendMessage}
               className="px-6 py-3 rounded-2xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition"
            >
               Send
            </button>

         </div>

      </div>
   );

}

export default ChatSection;