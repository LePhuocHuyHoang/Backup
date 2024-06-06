import "./App.css";
import "./style/_flex.scss";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/carousel";

import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import BookDetail from "./pages/BookDetail";
import AppLayout from "./pages/AppLayout";
import HomePage from "./pages/HomePage";
import UpdatePass from "./pages/UpdatePass";
import ForgotPass from "./pages/ForgotPass";
import Register from "./pages/Register";
import ReadBook from "./pages/ReadBook";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./auth/AuthProvider";

import Favorite from "./pages/Favorite";
import PaymentForm from "./pages/PaymentForm";
import RentedBook from "./pages/RentedBook";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="" index element={<HomePage />} />
            <Route path="book/:bookId" element={<BookDetail />} />
            <Route path="editProfile" element={<EditProfile />} />
            <Route path="changePassword" element={<ChangePassword />} />
            <Route path="/favoriteBook" element={<Favorite />} />
            <Route path="/buyPoint" element={<PaymentForm />} />
            <Route path="/history" element={<RentedBook />} />
          </Route>
          <Route path="updatePassword" element={<UpdatePass />} />
          <Route path="forgotPassword" element={<ForgotPass />} />

          <Route path="/register" element={<Register />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
          <Route path="/read/:bookId" element={<ReadBook />} />
        </Routes>
        <ToastContainer autoClose={5000} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
