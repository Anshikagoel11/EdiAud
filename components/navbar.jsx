'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="w-full m-8">

      {/* Navbar container */}
      <div
        className={`relative max-w-7xl mx-auto flex items-center justify-between px-8 py-5
        transition-all duration-300 rounded-lg 
        ${isScrolled
          ? 'bg-[#111214]/80 backdrop-blur-xl'
          : 'bg-[#111214]'
        }`}
      >
        {/* Left content */}
        <Link href="/">
       <div className="flex items-center gap-3">
  {/* Waveform Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className=" w-6 h-6 text-white/90 bg-gradient-to-l from-blue-600/80 via-indigo-500/50 to-transparent p-1 rounded-full"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 12h2v4H2v-4zm4-6h2v12H6V6zm4 8h2v4h-2v-4zm4-8h2v12h-2V6zm4 4h2v4h-2v-4z"
    />
  </svg>

  {/* Title */}
  <span className="text-2xl text-white/90 tracking-wide font-bold text-balance">
    EdiAud
  </span>
</div>
</Link>

        {/* Right placeholder (you can add menu or buttons here) */}
        <div className="flex items-center gap-4">
             <div
        className={`absolute top-0 right-0 h-[50%] pt-2 w-36 bg rounded-l-full blur-xl transition-opacity duration-300
        ${isScrolled ? 'opacity-100' : 'opacity-70'}
        bg-gradient-to-l from-blue-600/80 via-indigo-500/50 to-transparent`}
      />
        </div>
      </div>
    </nav>
  );
}
