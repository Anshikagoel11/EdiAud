'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div
        className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5
        transition-all duration-300 rounded-lg sm:rounded-xl md:rounded-2xl
        bg-[#111214]/80 backdrop-blur-sm sm:backdrop-blur-md md:backdrop-blur-xl"
      >
       
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
        
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white/90 
                bg-gradient-to-l from-blue-600/80 via-indigo-500/50 to-transparent 
                p-0.5 sm:p-1 rounded-full"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 12h2v4H2v-4zm4-6h2v12H6V6zm4 8h2v4h-2v-4zm4-8h2v12h-2V6zm4 4h2v4h-2v-4z"
              />
            </svg>

            
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl 
              text-white/90 tracking-wide font-bold text-balance whitespace-nowrap">
              EdiAud
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative">
          <div
            className={`absolute top-0 right-0 h-[40%] sm:h-[45%] md:h-[50%] 
              pt-1 sm:pt-2 w-16 sm:w-24 md:w-32 lg:w-36 
              rounded-l-full blur-md sm:blur-lg md:blur-xl transition-opacity duration-300
              opacity-100
              bg-gradient-to-l from-blue-600/60 via-indigo-500/40 to-transparent 
              sm:from-blue-600/70 sm:via-indigo-500/50 sm:to-transparent
              md:from-blue-600/80 md:via-indigo-500/50 md:to-transparent`}
          />
          
       
        </div>
      </div>
    </nav>
  );
}