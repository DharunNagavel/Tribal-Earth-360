import React, { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.jpg";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPattaOpenMobile, setIsPattaOpenMobile] = useState(false);
  const [isPattaOpenDesktop, setIsPattaOpenDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pattaDropdownRef = useRef(null);
  const location = useLocation();

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

  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(false);
    }
  }, [location]);

  const navbarClasses =
    location.pathname === "/"
      ? isScrolled
        ? "bg-green-700 shadow-md"
        : "bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
      : "bg-green-700 shadow-md";

  // Determine hover color based on navbar state
  const hoverColor = (location.pathname === "/" && !isScrolled) 
    ? "hover:text-[#590d22]" 
    : "hover:text-yellow-300";

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
          <li>
            <Link to="/" className={hoverColor}>Home</Link>
          </li>
          <li>
            <Link to="/digitalization" className={hoverColor}>Digitalize</Link>
          </li>
          <li className="relative">
            <button
              onClick={() => setIsPattaOpenDesktop(!isPattaOpenDesktop)}
              className={`flex items-center gap-1 sm:gap-2 ${hoverColor} focus:outline-none`}
            >
              Patta <ChevronDown size={16} />
            </button>
            {isPattaOpenDesktop && (
              <ul className="absolute left-0 top-full bg-green-800 mt-1 rounded-lg shadow-lg w-48 text-base overflow-hidden z-10">
                <li>
                  <Link to="/individual" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-300">
                    Individual
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-300">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/resource" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-300">
                    Community Resource
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/map" className={hoverColor}>Map</Link>
          </li>
          <li>
            <Link to="/about" className={hoverColor}>About FRA</Link>
          </li>
          <li>
            <Link to="/auth" className={hoverColor}>Signup/Login</Link>
          </li>
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
            <li>
              <Link to="/" className={hoverColor}>Home</Link>
            </li>
            <li>
            <Link to="/digitalization" className={hoverColor}>Digitalize</Link>
          </li>
            <li className="relative">
              <button
                className={`flex justify-between items-center w-full ${hoverColor}`}
                onClick={() => setIsPattaOpenMobile(!isPattaOpenMobile)}
              >
                Patta <ChevronDown size={16} />
              </button>
              <ul
                ref={pattaDropdownRef}
                className="ml-3 mt-2 flex flex-col gap-2 text-sm overflow-hidden h-0 opacity-0"
              >
                <li>
                  <Link to="/individual" className={hoverColor}>
                    Individual
                  </Link>
                </li>
                <li>
                  <Link to="/community" className={hoverColor}>
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/resource" className={hoverColor}>
                    Community Resource
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/map" className={hoverColor}>Map</Link>
            </li>
            <li>
              <Link to="/about" className={hoverColor}>About FRA</Link>
            </li>
            <li>
              <Link to="/auth" className={hoverColor}>Signup/Login</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};