import React, { useRef } from "react";
import { gsap } from "gsap";
import { RiBookShelfLine } from "react-icons/ri";
import { FaMapMarked } from "react-icons/fa";
import { MdSatelliteAlt } from "react-icons/md";
import { TbMapSearch } from "react-icons/tb";
import { FaWpforms } from "react-icons/fa6";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Bg from "../assets/bg.jpg";
gsap.registerPlugin(ScrollToPlugin);
export const Home = () => {
  const nextSectionRef = useRef(null);
  const handleScroll = () => {
  gsap.to(window, {
    duration: 1.2,
    scrollTo: { y: nextSectionRef.current, offsetY: 100 },
    ease: "power2.inOut"
  });
};

  return (
    <div>
      <div className="relative w-full">
        <img src={Bg} alt="Background" className="w-full h-auto" />
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-16 sm:bottom-24 md:bottom-32 lg:bottom-40">
          <button onClick={handleScroll} className="bg-green-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition text-base md:text-lg">
          Get Started
          </button>
       </div>
     </div>
      <div ref={nextSectionRef} className="py-16 bg-gray-100">
        <h3 className="text-3xl font-bold text-center mb-12">
           Powerful Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-16">
             <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition duration-300 group hover:bg-green-600 hover:text-white ">
                <h4 className="text-xl font-bold mb-2 text-center inline-flex items-center justify-center gap-2"><RiBookShelfLine className="text-2xl" /><span>Digitalise FRA records</span></h4>
                <p className="text-gray-600 group-hover:text-white">
                The digitalisation of FRA records unifies scattered claims, pattas, rules, and past tribal records into one centralized database. This ensures transparency, easy access, and standardization, making every tribal claim visible and traceable for government agencies.
                </p>
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition duration-300 group hover:bg-green-600 hover:text-white">
                  <h4 className="text-xl font-bold mb-2 text-center inline-flex items-center justify-center gap-2"><FaMapMarked className="text-2xl" /><span>WebGIS Integration</span></h4>
                  <p className="text-gray-600 group-hover:text-white">
                  The Interactive WebGIS will provide a real-time map-based platform to visualize FRA data, land use, forest cover, and community assets with multi-level filters. It enables government departments to track FRA implementation, overlay socio-economic datasets, and make data-driven decisions with greater transparency and efficiency.
                  </p>
             </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition duration-300 group hover:bg-green-600 hover:text-white">
                  <h4 className="text-xl font-bold mb-2 text-center inline-flex items-center justify-center gap-2"><TbMapSearch className="text-2xl" /><span>AI based Asset mapping</span></h4>
                  <p className="text-gray-600 group-hover:text-white">
                  AI-based Asset Mapping uses satellite imagery and computer vision to detect land, forests, water bodies, and homesteads, linking them with digitized FRA records. It displays details like acres allocated, beneficiaries, and rights category (IFR, CR, CFR), enabling the government to track resources, identify gaps, and deliver targeted support.
                  </p>
             </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition duration-300 group hover:bg-green-600 hover:text-white">
                  <h4 className="text-xl font-bold mb-2 text-center inline-flex items-center justify-center gap-2"><FaSortAmountUpAlt className="text-2xl"/><span>Decision Support System for Schemes</span></h4>
                  <p className="text-gray-600 group-hover:text-white">
                  The Scheme-Layering DSS in TribalEarth 360 analyzes FRA records and mapped resources to identify tribal patta holders’ eligibility for schemes like PM-KISAN, MGNREGA, and Jal Jeevan Mission. Using AI and GIS, it provides real-time recommendations, reduces paperwork, and ensures faster, targeted welfare delivery for tribal communities.
                 </p>
             </div>
             <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition duration-300 group hover:bg-green-600 hover:text-white">
                  <h4 className="text-xl font-bold mb-2 text-center inline-flex items-center justify-center gap-2"><FaWpforms className="text-2xl" /><span>Applying Patta</span></h4>
                  <p className="text-gray-600 group-hover:text-white">
                  TribalEarth 360 offers a digital platform for tribal communities to easily apply for land pattas with guided support at every step. By using digitized FRA records, it ensures accurate, complete, and legally compliant submissions, reducing delays and rejections in the process.
                  </p>
              </div>
              <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition duration-300 group hover:bg-green-600 hover:text-white">
                  <h4 className="text-xl font-bold mb-2 text-center inline-flex items-center justify-center gap-2"><MdSatelliteAlt className="text-2xl" /><span>Tracking Current Status</span></h4>
                  <p className="text-gray-600 group-hover:text-white">
                  TribalEarth 360 provides a complete digital solution for tribal communities to apply for and manage land pattas with step-by-step guidance. With real-time status tracking, timely notifications, and transparent updates from submission to approval, it ensures accuracy, compliance, and a hassle-free application process.
                  </p>
              </div>
         </div>
      </div>
   </div>
  );
};
