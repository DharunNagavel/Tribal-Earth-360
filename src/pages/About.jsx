import React from "react";
import { FaPerson, FaPeopleGroup, FaDownload } from "react-icons/fa6";
import { GiForest } from "react-icons/gi";

export const About = () => {
  return (
    <div className="pt-28 pb-16 px-6 md:px-16 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-start justify-between mb-6 mt-5">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1b4332]">
              About the Forest Rights Act (FRA)
            </h1>
          </div>
          <div className="relative group">
            <a href="/FRARulesBook.pdf" download="FRARulesBook.pdf" className="bg-[#1b4332] p-3 rounded-full shadow hover:shadow-md transition inline-block">
            <FaDownload className="text-3xl text-white " />
           </a>
          <span className="absolute right-1/2 transform translate-x-1/2 top-full mt-2 bg-[#1b4332] text-white text-sm rounded-md px-3 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap z-10">
          Download FRA rule book
          </span>
       </div>

        </div>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10 text-center">
          The <strong>Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006</strong>, commonly known as the <strong>Forest Rights Act (FRA)</strong>, was enacted to correct historical injustices and empower forest-dwelling communities by recognizing their rights over forest land and resources.
        </p>
      </div>
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1b4332] mb-4">
          Objectives of FRA
        </h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
          <li>Recognize and vest forest rights in Scheduled Tribes and other traditional forest dwellers.</li>
          <li>Provide legal empowerment and livelihood security to forest-dependent communities.</li>
          <li>Promote sustainable management and conservation of forests.</li>
          <li>Ensure equitable governance of forest resources.</li>
        </ul>
      </div>
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1b4332] mb-6 text-center">
          Types of Rights under FRA
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-6 transition transform hover:-translate-y-1 hover:bg-[#78C6A3]">
            <h3 className="text-xl font-bold mb-2 text-center inline-flex items-center justify-center gap-2">
              <FaPerson className="text-2xl" />
              <span>Individual Rights</span>
            </h3>
            <p className="text-center">
              Rights to hold and live on forest land for self-cultivation and habitation.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 transition transform hover:-translate-y-1 hover:bg-[#78C6A3]">
            <h3 className="text-xl font-bold mb-2 text-center inline-flex items-center justify-center gap-2">
              <FaPeopleGroup className="text-2xl" />
              <span>Community Rights</span>
            </h3>
            <p className="text-center">
              Rights over common forest resources like grazing land, fuel wood, and minor forest produce.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 transition transform hover:-translate-y-1 hover:bg-[#78C6A3] ">
            <h3 className="text-xl font-bold mb-2 text-center inline-flex items-center justify-center gap-2">
              <GiForest className="text-5xl" />
              <span>Community Forest Resource (CFR) Rights</span>
            </h3>
            <p className="text-center">
              Rights to protect, regenerate, conserve, and manage community forest resources sustainably.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1b4332] mb-4">
          Who Benefits?
        </h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
          <li>Scheduled Tribes (STs) residing in forests. (Cut-off Date: 13 December 2005)</li>
          <li>Other Traditional Forest Dwellers (OTFDs) living in forests for at least 75 years before 2005.</li>
        </ul>
      </div>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1b4332] mb-4">
          Importance of FRA
        </h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
          <li>Provides land tenure security to vulnerable communities.</li>
          <li>Ensures livelihood and food security.</li>
          <li>Promotes decentralized forest governance.</li>
          <li>Strengthens equity in natural resource management.</li>
        </ul>
      </div>
    </div>
  );
};
