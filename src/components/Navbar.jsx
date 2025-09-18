import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.jpg";

export const Navbar = ({ user, setuser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPattaOpenMobile, setIsPattaOpenMobile] = useState(false);
  const [isPattaOpenDesktop, setIsPattaOpenDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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
      setIsScrolled(true); // force solid color on other pages
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

  // Navbar background classes
  const navbarClasses =
    location.pathname === "/"
      ? isScrolled
        ? "bg-[#78C6A3] shadow-md"
        : "bg-[#78C6A3]/30 backdrop-blur-md border border-white/30 shadow-lg"
      : "bg-[#78C6A3] shadow-md";

  // Navbar hover color
  const hoverColor =
    location.pathname === "/" && !isScrolled
      ? "hover:text-[#800000]" // maroon hover on glass
      : "hover:text-[#800000]"; // normal hover when scrolled or other pages

  const menuItems = user
    ? [
        { name: "Home", path: "/" },
        { name: "Digitalize", path: "/digitalization" },
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
        { name: "Logout", action: () => { setuser(false); navigate("/auth"); } },
      ]
    : [
        { name: "Home", path: "/auth" },
        { name: "Digitalize", path: "/auth" },
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

  const handleItemClick = () => {
    setIsOpen(false);
    setIsPattaOpenDesktop(false);
  };

  return (
    <nav
      className={`fixed w-full rounded-4xl top-2 left-0 z-50 transition-all duration-500 ${navbarClasses}`}
    >
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between w-full items-center py-3 text-white">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="TribalEarth360 Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full bg-white p-1"
          />
          <h1 className="text-xl sm:text-2xl font-bold">TribalEarth360</h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-6 text-lg items-center">
          {menuItems.map((item, i) =>
            item.subMenu ? (
              <li key={i} className="relative" ref={desktopDropdownRef}>
                <button
                  onClick={() => setIsPattaOpenDesktop(!isPattaOpenDesktop)}
                  className={`flex items-center gap-1 ${hoverColor} focus:outline-none py-2 px-1`}
                >
                  {item.name} <ChevronDown size={18} />
                </button>
                {isPattaOpenDesktop && (
                  <ul className="absolute left-0 top-full bg-[#78C6A3] mt-1 rounded-lg shadow-lg w-48 text-base overflow-hidden z-10">
                    {item.subMenu.map((sub, j) => (
                      <li key={j}>
                        <Link
                          to={sub.path}
                          className="block px-3 py-2  hover:text-[#800000]"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : item.action ? (
              <li key={i}>
                <button 
                  onClick={() => {
                    item.action();
                    handleItemClick();
                  }} 
                  className={`${hoverColor} py-2 px-1`}
                >
                  {item.name}
                </button>
              </li>
            ) : (
              <li key={i}>
                <Link 
                  to={item.path} 
                  className={`${hoverColor} py-2 px-1`}
                  onClick={handleItemClick}
                >
                  {item.name}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-lg "
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#78C6A3] px-4 pb-3">
          <ul className="flex flex-col gap-3 text-base">
            {menuItems.map((item, i) =>
              item.subMenu ? (
                <li key={i} className="relative" ref={mobileDropdownWrapperRef}>
                  <button
                    className={`flex justify-between items-center w-full py-3 ${hoverColor}`}
                    onClick={() => setIsPattaOpenMobile(!isPattaOpenMobile)}
                  >
                    {item.name} <ChevronDown size={18} />
                  </button>
                  <ul
                    ref={pattaDropdownRef}
                    className="ml-4 mt-2 flex flex-col gap-3 text-base overflow-hidden h-0 opacity-0"
                  >
                    {item.subMenu.map((sub, j) => (
                      <li key={j}>
                        <Link 
                          to={sub.path} 
                          className={`block py-2 ${hoverColor}`}
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : item.action ? (
                <li key={i}>
                  <button 
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }} 
                    className={`block w-full text-left py-3 ${hoverColor}`}
                  >
                    {item.name}
                  </button>
                </li>
              ) : (
                <li key={i}>
                  <Link 
                    to={item.path} 
                    className={`block py-3 ${hoverColor}`}
                    onClick={() => setIsOpen(false)}
                  >
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