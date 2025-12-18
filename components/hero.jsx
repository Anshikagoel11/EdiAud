'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export const Hero = () => {
  const [waveHeights, setWaveHeights] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    setIsClient(true);
    calculateWaveHeights(0);
    
    const handleResize = () => calculateWaveHeights(waveOffset);
    window.addEventListener('resize', handleResize);
    
    // Animate the wave by updating offset
    const interval = setInterval(() => {
      setWaveOffset(prev => {
        const newOffset = prev + 0.1;
        calculateWaveHeights(newOffset);
        return newOffset;
      });
    }, 50);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  const calculateWaveHeights = (offset) => {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    let baseHeight = 30;
    let amplitude = 60;
    let barCount = 70;
    
    if (width < 640) { // Mobile
      amplitude = 20;
      baseHeight = 15;
      barCount = 50;
    } else if (width < 768) { // Small tablet
      amplitude = 40;
      baseHeight = 25;
      barCount = 60;
    } else if (width < 1024) { // Tablet
      amplitude = 50;
      baseHeight = 30;
      barCount = 65;
    }
    
    const heights = [...Array(barCount)].map((_, i) => 
      Math.sin(i * 0.3 + offset) * amplitude + baseHeight
    );
    setWaveHeights(heights);
  };

  const getStaticHeight = (i) => {
    return Math.sin(i * 0.3) * 20 + 15;
  };

  const barCount = waveHeights.length || 50;

  return (
    <div className="py-2 sm:py-5 md:py-6 ">
      <div className="max-w-4xl mx-auto h-auto min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] lg:h-[90vh] px-3 sm:px-4 md:px-6">
        <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-7">
          {/* Animated heading with staggered entrance */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-black text-balance mb-3 sm:mb-4 md:mb-5 leading-snug sm:leading-tight">
            <span className="inline-block opacity-0 animate-fadeInUp animation-delay-100">
              Shape your&nbsp;
            </span>
            <span className="inline-block opacity-0 animate-fadeInUp animation-delay-300 bg-gradient-to-l from-blue-400 via-indigo-400 to-purple-300 bg-clip-text text-transparent">
              Sound
            </span>
            <br className="hidden xs:block" />
            <span className="inline-block opacity-0 animate-fadeInUp animation-delay-500">
              Your way
            </span>
          </h1>

          {/* Wave visualization - Moving animation */}
          <div className="h-12 sm:h-14 md:h-16 lg:h-20 flex items-end justify-center gap-0.5 sm:gap-1 px-2 sm:px-4 overflow-x-auto md:overflow-visible mb-4 sm:mb-6">
            {[...Array(barCount)].map((_, i) => (
              <div
                key={i}
                className="w-1 sm:w-1.5 md:w-2 rounded-t-sm sm:rounded-t-md md:rounded-t-lg bg-gradient-to-t from-blue-500/50 to-purple-500/50 transition-all duration-75 ease-out"
                style={{
                  height: `${isClient && waveHeights.length > 0 ? waveHeights[i] : getStaticHeight(i)}px`
                }}
              />
            ))}
          </div>

          {/* Description text */}
          <p className="text-center text-pretty text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 mx-auto text-indigo-100 opacity-0 animate-fadeIn animation-delay-700 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl px-2 sm:px-4">
            From quick trims to professional effects, manage your audio exactly the way you want. Simple, fast, and powerful
          </p>
          
          {/* CTA Button */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mx-auto max-w-fit py-3 sm:py-4 md:py-5 opacity-0 animate-fadeIn animation-delay-900">
            <Link href="/edit-audio" className="scroll-smooth">
            <button className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 font-medium text-white rounded-xl sm:rounded-2xl border border-indigo-400/50 bg-indigo-600/10 backdrop-blur-sm hover:bg-indigo-600/20 hover:scale-[1.02] sm:hover:scale-[1.05] active:scale-[0.98] transition-all duration-200">
              {/* Shiny overlay */}
              <span className="absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl">
                <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              </span>

              {/* Button text */}
              <span className="relative text-sm sm:text-base font-bold">Edit Now</span>

              {/* Arrow icon */}
              <svg
                className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 relative transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            </Link>
          </div>

        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes shine {
          to {
            transform: translateX(100%);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-shine {
          animation: shine 2s infinite;
        }
        
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        
        .animation-delay-900 {
          animation-delay: 900ms;
        }
        
        /* Extra small screens */
        @media (max-width: 380px) {
          h1 {
            font-size: 1.75rem !important;
            line-height: 2rem !important;
          }
        }
        
        @media (max-width: 280px) {
          h1 {
            font-size: 1.5rem !important;
          }
          p {
            font-size: 0.875rem !important;
          }
        }
      `}</style>
    </div>
  );
};