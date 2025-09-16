import React, { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPattaOpenMobile, setIsPattaOpenMobile] = useState(false);
  const [isPattaOpenDesktop, setIsPattaOpenDesktop] = useState(false);
  const pattaDropdownRef = useRef(null);

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

  return (
    <nav className="bg-green-700 text-white shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="TribalEarth360 Logo"
            className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-cover rounded-full bg-white p-1.5"
          />
          <h1 className="text-2xl sm:text-3xl font-bold">TribalEarth360</h1>
        </div>

        
        <ul className="hidden lg:flex gap-8 text-lg xl:text-xl items-center">
          <li>
            <Link to="/" className="hover:text-yellow-300">Home</Link>
          </li>
          <li className="relative">
            <button
              onClick={() => setIsPattaOpenDesktop(!isPattaOpenDesktop)}
              className="flex items-center gap-2 hover:text-yellow-300 focus:outline-none"
            >
              Patta <ChevronDown size={20} />
            </button>
            {isPattaOpenDesktop && (
              <ul className="absolute left-0 top-full bg-green-800 mt-2 rounded-lg shadow-lg w-60 text-lg overflow-hidden z-10">
                <li>
                  <Link to="/individual" className="block px-4 py-2 hover:bg-green-700">
                    Individual
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="block px-4 py-2 hover:bg-green-700">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/resource" className="block px-4 py-2 hover:bg-green-700">
                    Community Resource
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/map" className="hover:text-yellow-300">Map</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-yellow-300">About FRA</Link>
          </li>
          <li>
            <Link to="/auth" className="hover:text-yellow-300">Signup/Login</Link>
          </li>
        </ul>

       
        <button
          className="lg:hidden p-3 rounded-lg hover:bg-green-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

     
      {isOpen && (
        <div className="lg:hidden bg-green-800 px-6 pb-4">
          <ul className="flex flex-col gap-5 text-lg">
            <li>
              <Link to="/" className="hover:text-yellow-300">Home</Link>
            </li>
            <li className="relative">
              <button
                className="flex justify-between items-center w-full hover:text-yellow-300"
                onClick={() => setIsPattaOpenMobile(!isPattaOpenMobile)}
              >
                Patta <ChevronDown size={20} />
              </button>
              <ul
                ref={pattaDropdownRef}
                className="ml-4 mt-3 flex flex-col gap-3 text-base overflow-hidden h-0 opacity-0"
              >
                <li>
                  <Link to="/individual" className="hover:text-yellow-300">
                    Individual
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-yellow-300">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/resource" className="hover:text-yellow-300">
                    Community Resource
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/map" className="hover:text-yellow-300">Map</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-yellow-300">About FRA</Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-yellow-300">Signup/Login</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
