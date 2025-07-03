import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaTasks } from "react-icons/fa";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex w-full py-3 bg-white shadow-grey shadow-2xl px-10 text-center items-center justify-between max-sm:px-3">
      <FaTasks className="text-2.5xl cursor-pointer" onClick={handleClick} />

      {isLoggedIn && (
        <div
          className="bg-black text-grey px-6 py-1.5 rounded-3xl text-base tracking-wider cursor-pointer hover:bg-slate-950 transition-all ease-in-out duration-200"
          onClick={handleLogout}
        >
          Logout
        </div>
      )}
    </div>
  );
};

export default Navbar;
