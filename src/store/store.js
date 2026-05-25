import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import themeReducer from "./themeSlice"
import notificationReducer from './notificationSlice'

const store = configureStore({
    reducer:{
        'auth':authReducer,
        'theme':themeReducer,
        'notification':notificationReducer,
    }
})

export default store;