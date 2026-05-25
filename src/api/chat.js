import {api} from "./index.js"

export const sendMessage= (id,data)=>api.post(`chat/send/${id}`,data)
export const getMessages= (id)=>api.get(`chat/${id}`)
export const deleteMessage =(id)=>api.delete(`/chat/message/${id}`);