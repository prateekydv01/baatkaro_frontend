import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";

import store from "./store/store.js";

import { Provider } from "react-redux";

import {
  RouterProvider,
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import AuthLayout from "./components/auth/AuthLayout.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignupPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MyFriendsPage from "./pages/MyFriendsPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      {/* Home */}
      <Route index element={<HomePage />} />

      {/* Auth */}
      <Route
        path="login"
        element={
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        }
      />

      <Route
        path="signup"
        element={
          <AuthLayout authentication={false}>
            <SignUpPage />
          </AuthLayout>
        }
      />

      {/* Protected */}
      <Route
        path="friends"
        element={
          <AuthLayout authentication={true}>
            <MyFriendsPage />
          </AuthLayout>
        }
      />
      <Route
        path="chat"
        element={
          <AuthLayout authentication={true}>
            <ChatPage />
          </AuthLayout>
        }
      />

    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);