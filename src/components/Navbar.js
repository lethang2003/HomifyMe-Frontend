import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  HomeIcon,
  InformationCircleIcon,
  PhoneIcon,
  LoginIcon,
  SearchIcon,
  AdjustmentsIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import logoHomifyMe1 from "../assets/logoHomifyMe1.png";
import { getToken } from "./Login/app/static";
import { useAuth } from "./context/UserContext";
import Favorite from "./Home/Favorite";

const Navbar = ({ onSearch }) => {
  const { profile, logOut, setProfile } = useAuth();
  const token = getToken();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      const response = await fetch("/users/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        setProfile(null);
        navigate("/login");
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      } else {
        console.error("Đăng xuất thất bại");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình đăng xuất:", error);
    }
  };

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const navigationItems = [
    {
      icon: HomeIcon,
      label: "Trang chủ",
      path: "/",
    },
    {
      icon: HomeIcon,
      label: "Danh sách trọ",
      path: "/houses-list",
    },
    {
      icon: InformationCircleIcon,
      label: "Về chúng tôi",
      path: "/about",
    },
    {
      icon: PhoneIcon,
      label: "Liên hệ",
      path: "/contact",
    },
  ];

  return (
    <nav className="bg-white text-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="flex items-center hover:opacity-90 transition-opacity duration-200"
            >
              <img
                src={logoHomifyMe1}
                alt="HomifyMe Logo"
                className="h-14 w-auto"
              />
              <span className="ml-3 text-orange-500 text-2xl font-bold tracking-tight">
                HomifyMe
              </span>
            </Link>
          </div>

          {/* Search Section - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm phòng trọ..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full px-4 py-2.5 pr-12 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Admin Dashboard */}
            {profile?.admin && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
              >
                <AdjustmentsIcon className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
            )}

            {/* Navigation Items */}
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Auth Section */}
            {!token || !profile ? (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium shadow-sm"
              >
                <LoginIcon className="w-5 h-5" />
                <span>Đăng nhập</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                {/* Favorite - Non-admin only */}
                {!profile?.admin && (
                  <div className="flex items-center">
                    <Favorite />
                  </div>
                )}

                {/* User Profile Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-orange-200 transition-all duration-200"
                  >
                    <img
                      src={profile.avatarUrl || "/path/to/default-avatar.png"}
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover"
                    />
                    <span className="hidden xl:block text-sm font-medium text-gray-700 max-w-24 truncate">
                      {profile.username || profile.email}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {profile.username || profile.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {profile.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Thông tin cá nhân
                      </Link>

                      <Link
                        to="/user-history"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Lịch sử giao dịch
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Cài đặt
                      </Link>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm phòng trọ..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full px-4 py-2.5 pr-12 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-orange-500 transition-colors duration-200"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {/* Admin Dashboard - Mobile */}
            {profile?.admin && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <AdjustmentsIcon className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Bảng điều khiển</span>
              </Link>
            )}

            {/* Navigation Items - Mobile */}
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 text-orange-500" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Auth Section - Mobile */}
            {!token || !profile ? (
              <Link
                to="/login"
                className="flex items-center space-x-3 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LoginIcon className="w-5 h-5" />
                <span>Đăng nhập/Đăng ký</span>
              </Link>
            ) : (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                {/* User Info */}
                <div className="flex items-center space-x-3 px-4 py-2">
                  <img
                    src={profile.avatarUrl || "/path/to/default-avatar.png"}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {profile.username || profile.email}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {/* Favorite - Non-admin only */}
                {!profile?.admin && (
                  <div className="px-4 py-2">
                    <Favorite />
                  </div>
                )}

                {/* Profile Menu Items */}
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Thông tin cá nhân
                </Link>

                <Link
                  to="/user-history"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Lịch sử giao dịch
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cài đặt
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
