import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaClipboard,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"; 
import { images } from "../utils/images";

const UserLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      navigate("/signInUp");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserName(data.user.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-blue-900 text-white h-full transition-all duration-300 shadow-lg`}
      >
        <div className="flex items-center justify-center space-x-3 bg-blue-700 h-16 py-2">
          <NavLink
            to="/"
            className={`flex items-center p-4 h-full lg:p-0 ${
              isOpen ? "block" : "hidden"
            } `}
          >
            <img
              src={images.logo}
              alt="Flexi Leave Logo"
              className="h-full mr-2 rounded-xl"
            />
          </NavLink>
          <button
            onClick={toggleSidebar}
            className="text-xl focus:outline-none"
          >
            <FaBars />
          </button>
        </div>
        <nav className="mt-6">
          <ul className="space-y-6 px-4">
            <li>
              <NavLink
                to={isAdmin ? "/admin/dashboard" : "/employee/dashboard"}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg ${
                    isActive ? "bg-blue-700" : "hover:bg-blue-800"
                  } transition`
                }
              >
                <FaTachometerAlt className="text-lg" />
                <span className={`ml-4 ${isOpen ? "block" : "hidden"}`}>
                  Dashboard
                </span>
              </NavLink>
            </li>
            {isAdmin ? (
              <>
                <li>
                  <NavLink
                    to="/admin/leave-requests"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg ${
                        isActive ? "bg-blue-700" : "hover:bg-blue-800"
                      } transition`
                    }
                  >
                    <FaClipboard className="text-lg" />
                    <span className={`ml-4 ${isOpen ? "block" : "hidden"}`}>
                      Leave Requests
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg ${
                        isActive ? "bg-blue-700" : "hover:bg-blue-800"
                      } transition`
                    }
                  >
                    <FaUsers className="text-lg" />
                    <span className={`ml-4 ${isOpen ? "block" : "hidden"}`}>
                      Manage Employees
                    </span>
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <NavLink
                  to="/employee/request-leave"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg ${
                      isActive ? "bg-blue-700" : "hover:bg-blue-800"
                    } transition`
                  }
                >
                  <FaClipboard className="text-lg" />
                  <span className={`ml-4 ${isOpen ? "block" : "hidden"}`}>
                    Request Leave
                  </span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <nav className="flex items-center justify-between py-4 px-10 bg-blue-900 text-white shadow">
          <h1 className="text-2xl font-semibold">
            {isAdmin ? "Admin" : "Employee"} Dashboard
          </h1>
          <div className="flex items-center space-x-5">
            Hi,
            <div className="flex items-center ml-2 space-x-4 hover:text-gray-200 transition">
              <span className="font-semibold">{userName || "Loading..."}</span>
              <FaUserCircle className="text-lg mr-2" />
            </div>
            <Link to="/signInUp">
              <button
                className="flex items-center hover:text-red-300 transition"
                onClick={() => {
                  localStorage.removeItem("auth-token");
                }}
              >
                <FaSignOutAlt className="text-lg mr-2" />
              </button>
            </Link>
          </div>
        </nav>

        <div className="flex-1 p-10">{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
