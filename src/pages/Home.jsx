import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
import { RiBookShelfLine } from "react-icons/ri";
import { FaMapMarked, FaSortAmountUpAlt } from "react-icons/fa";
import { MdSatelliteAlt } from "react-icons/md";
import { TbMapSearch } from "react-icons/tb";
import { FaWpforms } from "react-icons/fa6";
import Bg from "../assets/bg.jpg";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const Home = () => {
  const featuresRef = useRef(null);
  const cardRefs = useRef([]);

  const features = [
    {
      icon: <RiBookShelfLine className="text-2xl" />,
      title: "Digitalise FRA records",
      description:
        "The digitalisation of FRA records unifies scattered claims, pattas, rules, and past tribal records into one centralized database.",
    },
    {
      icon: <FaMapMarked className="text-2xl" />,
      title: "WebGIS Integration",
      description:
        "Interactive WebGIS to visualize FRA data, land use, forest cover, and community assets with multi-level filters.",
    },
    {
      icon: <TbMapSearch className="text-2xl" />,
      title: "AI based Asset mapping",
      description:
        "Uses satellite imagery and computer vision to detect land, forests, water bodies, and homesteads.",
    },
    {
      icon: <FaSortAmountUpAlt className="text-2xl" />,
      title: "Decision Support System",
      description:
        "Analyzes FRA records and mapped resources to identify tribal patta holders' eligibility for schemes.",
    },
    {
      icon: <FaWpforms className="text-2xl" />,
      title: "Applying Patta",
      description:
        "Digital platform for tribal communities to easily apply for land pattas with guided support.",
    },
    {
      icon: <MdSatelliteAlt className="text-2xl" />,
      title: "Tracking Current Status",
      description:
        "Complete digital solution to apply for and manage land pattas with step-by-step guidance.",
    },
  ];

  useEffect(() => {
    // Animate cards on scroll
    cardRefs.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  }, []);

  const handleScrollToFeatures = () => {
    if (featuresRef.current) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: featuresRef.current, offsetY: 100 },
        ease: "power2.inOut",
      });
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        <img 
          src={Bg} 
          alt="Background" 
          className="w-full h-auto max-w-full" 
        />
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-16 sm:bottom-24 md:bottom-32 lg:bottom-40">
          <button
            onClick={handleScrollToFeatures}
            className="bg-black text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition text-base md:text-lg"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">
            Powerful Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                ref={(el) => (cardRefs.current[idx] = el)}
                className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition duration-300 group hover:bg-green-600 hover:text-white"
              >
                <h4 className="text-xl font-bold mb-2 inline-flex items-center justify-center gap-2">
                  {feature.icon} <span>{feature.title}</span>
                </h4>
                <p className="text-gray-600 group-hover:text-white">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};