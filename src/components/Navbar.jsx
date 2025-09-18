import React, { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.jpg";

export const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPattaOpenMobile, setIsPattaOpenMobile] = useState(false);
  const [isPattaOpenDesktop, setIsPattaOpenDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pattaDropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownWrapperRef = useRef(null);
  const location = useLocation();

  // Animate Mobile dropdown
  useEffect(() => {
    if (pattaDropdownRef.current) {
      if (isPattaOpenMobile) {
        gsap.to(pattaDropdownRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(pattaDropdownRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    }
  }, [isPattaOpenMobile]);

  // Scroll effect only on home page
  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => setIsScrolled(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(false);
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target)
      ) {
        setIsPattaOpenDesktop(false);
      }
      if (
        mobileDropdownWrapperRef.current &&
        !mobileDropdownWrapperRef.current.contains(e.target)
      ) {
        setIsPattaOpenMobile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navbarClasses =
    location.pathname === "/"
      ? isScrolled
        ? "bg-green-700 shadow-md"
        : "bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
      : "bg-green-700 shadow-md";

  const hoverColor =
    location.pathname === "/" && !isScrolled
      ? "hover:text-[#590d22]"
      : "hover:text-yellow-300";

  // Dynamic routes: different for logged in vs logged out
  const menuItems = user
    ? [
        { name: "Home", path: "/" },
        {
          name: "Patta",
          subMenu: [
            { name: "Individual", path: "/individual" },
            { name: "Community", path: "/community" },
            { name: "Community Resource", path: "/resource" },
          ],
        },
        { name: "Map", path: "/map" },
        { name: "About FRA", path: "/about" },
        { name: "Logout", path: "/auth" }, // or handle logout differently
      ]
    : [
        { name: "Home", path: "/auth" },
        {
          name: "Patta",
          subMenu: [
            { name: "Individual", path: "/auth" },
            { name: "Community", path: "/auth" },
            { name: "Community Resource", path: "/auth" },
          ],
        },
        { name: "Map", path: "/auth" },
        { name: "About FRA", path: "/auth" },
        { name: "Signup/Login", path: "/auth" },
      ];

  return (
    <nav
      className={`fixed w-full top-2 left-0 z-50 transition-all duration-500 rounded-4xl ${navbarClasses}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2 sm:py-3 text-white">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={Logo}
            alt="TribalEarth360 Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full bg-white p-1"
          />
          <h1 className="text-lg sm:text-2xl font-bold">TribalEarth360</h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-5 text-base sm:text-lg items-center">
          {menuItems.map((item, i) =>
            item.subMenu ? (
              <li key={i} className="relative" ref={desktopDropdownRef}>
                <button
                  onClick={() => setIsPattaOpenDesktop(!isPattaOpenDesktop)}
                  className={`flex items-center gap-1 sm:gap-2 ${hoverColor} focus:outline-none`}
                >
                  {item.name} <ChevronDown size={16} />
                </button>
                {isPattaOpenDesktop && (
                  <ul className="absolute left-0 top-full bg-green-800 mt-1 rounded-lg shadow-lg w-48 text-base overflow-hidden z-10">
                    {item.subMenu.map((sub, j) => (
                      <li key={j}>
                        <Link
                          to={sub.path}
                          className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-300"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={i}>
                <Link to={item.path} className={hoverColor}>
                  {item.name}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-green-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-green-800 px-4 pb-3">
          <ul className="flex flex-col gap-3 text-base">
            {menuItems.map((item, i) =>
              item.subMenu ? (
                <li key={i} className="relative" ref={mobileDropdownWrapperRef}>
                  <button
                    className={`flex justify-between items-center w-full ${hoverColor}`}
                    onClick={() => setIsPattaOpenMobile(!isPattaOpenMobile)}
                  >
                    {item.name} <ChevronDown size={16} />
                  </button>
                  <ul
                    ref={pattaDropdownRef}
                    className="ml-3 mt-2 flex flex-col gap-2 text-sm overflow-hidden h-0 opacity-0"
                  >
                    {item.subMenu.map((sub, j) => (
                      <li key={j}>
                        <Link to={sub.path} className={hoverColor}>
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={i}>
                  <Link to={item.path} className={hoverColor}>
                    {item.name}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};
