import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   notifications: []
};

const notificationSlice = createSlice({

   name: "notification",

   initialState,

   reducers: {

      setNotifications: (
         state,
         action
      ) => {

         state.notifications =
            action.payload;
      },

      addNotification: (
         state,
         action
      ) => {

         state.notifications.unshift(
            action.payload
         );
      },

      markNotificationRead: (
         state,
         action
      ) => {

         state.notifications =
            state.notifications.map((n) =>

               n._id === action.payload
                  ? {
                       ...n,
                       isRead: true
                    }
                  : n
            );
      },

      removeNotification:(state,action)=>{

         state.notifications =
            state.notifications.filter(
               (n)=>
                  n._id !== action.payload
            );

      },
      updateNotification:(state,action)=>{

   state.notifications =
      state.notifications.map(
         (notification)=>

            notification._id ===
            action.payload._id

            ? action.payload

            : notification
      );

}
   }
});

export const {

   setNotifications,
   addNotification,
   markNotificationRead,
   removeNotification,
   updateNotification

} = notificationSlice.actions;

export default notificationSlice.reducer;