import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const Final = () => {
  const pathRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const tl = gsap.timeline();
    
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.out"
    })
    .to(svg, {
      scale: 1.2,
      transformOrigin: "50% 50%",
      duration: 0.3,
      ease: "elastic.out(1, 0.5)"
    })
    .to(svg, {
      scale: 1,
      duration: 0.2,
      ease: "power1.out"
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full flex flex-col items-center">
        <svg
          ref={svgRef}
          className="w-24 h-24 text-green-500 mb-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={pathRef}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-3xl font-semibold text-gray-800 text-center">
          Patta successfully registered
        </h1>
      </div>
    </div>
  );
};

export default Final;
