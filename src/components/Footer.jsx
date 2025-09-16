import React from 'react'
import Useful from "../assets/useful.png";
import Useful1 from "../assets/useful1.png";
import { Facebook, Instagram, MessageCircle, Copyright } from "lucide-react";

export const Footer = () => {
  return (
    <div>
      <footer className="bg-green-700 text-white pt-10 pb-6 border-t border-gray-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/" className="hover:text-yellow-300">Home</a></li>
              <li><a href="/patta" className="hover:text-yellow-300">Patta</a></li>
              <li><a href="/map" className="hover:text-yellow-300">Map</a></li>
              <li><a href="/about" className="hover:text-yellow-300">About FRA</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Useful Links</h3>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <a
                href="https://tribal.nic.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={Useful}
                  alt="Ministry of Tribal Affairs"
                  className="h-32 w-42 bg-white p-2 rounded-lg hover:opacity-80 transition"
                />
              </a>
              <a
                href="https://forestrights.nic.in/fra/home"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={Useful1}
                  alt="Forest Rights Act"
                  className="h-32 w-42 bg-white p-2 rounded-lg hover:opacity-80 transition"
                />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Get in Touch</h3>
            <div className="flex space-x-4 mt-3">
              <a href="/" target="_blank" rel="noreferrer" className="text-white hover:text-yellow-300">
                <Facebook size={20} />
              </a>
              <a href="/" target="_blank" rel="noreferrer" className="text-white hover:text-yellow-300">
                <Instagram size={20} />
              </a>
              <a href="/" target="_blank" rel="noreferrer" className="text-white hover:text-yellow-300">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
        <p className="text-center mt-6 text-sm flex items-center justify-center gap-1">
          <Copyright size={14} /> Last Updated on 10, September 2025
        </p>
      </footer>
    </div>
  )
}
