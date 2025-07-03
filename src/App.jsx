import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/common/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import TaskDashboard from "./components/TaskDashboard";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col h-screen bg-gray-100 poppins-regular">
          <Navbar />
          <div className="flex-grow bg-grey">
            <Routes>
              <Route path="/login" element={<Login />} />
               <Route element={<ProtectedRoute />}>
                <Route path="/" element={<TaskDashboard />} />
              </Route>
              {/* Wildcard route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
