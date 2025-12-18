'use client';
import Link from 'next/link';

export const Hero = () => {
  return (
    <div className="py-5">
      <div className="max-w-4xl h-[85vh] lg:h-[90vh] center px-2">
        <div className="mt-10 sm:mt-16">
          {/* Animated heading with staggered entrance */}
          <h1 className="text-4xl md:text-5xl text-center font-black text-balance lg:text-6xl h1 mb-4 leading-tight">
            <span className="inline-block opacity-0 animate-fadeInUp animation-delay-100">
  Shape your&nbsp;
</span>

<span className="inline-block opacity-0 animate-fadeInUp animation-delay-300 bg-gradient-to-l from-blue-400 via-indigo-400 to-purple-300 bg-clip-text text-transparent">
  Sound
</span>

            <br />
            <span className="inline-block opacity-0 animate-fadeInUp animation-delay-500">
              Your way
            </span>
          </h1>
           <div className="h-30 flex items-end  justify-center gap-1 px-2">
                  {[...Array(65)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 rounded-t-lg bg-gradient-to-t from-blue-500/50 to-purple-500/50"
                      style={{
                        height: `${Math.sin(i * 0.3) * 20 + 30}px`,
                        animation: `wave 1.5s ease-in-out ${i * 0.05}s infinite alternate`
                      }}
                    />
                  ))}
                </div>
          <p className="text-center text-pretty text-lg mb-4 mx-auto text-indigo-100 opacity-0 animate-fadeIn animation-delay-700">
            From quick trims to professional effects, manage your audio exactly the way you want. Simple, fast, and powerful
          </p>
          
          <div className="flex-row-center gap-4 mx-auto max-w-fit py-4 opacity-0 animate-fadeIn animation-delay-900">
  <Link href="/edit-audio">
    <button className="group relative inline-flex items-center justify-center px-8 py-3 font-medium text-white rounded-2xl border">
      {/* Shiny overlay */}
      <span className="absolute inset-0 overflow-hidden">
        <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
      </span>

      {/* Button text */}
      <span className="relative text-base font-bold">Edit Now</span>

      {/* Arrow icon */}
      <svg
        className="ml-2 w-5 h-5 relative transition-transform duration-300 group-hover:translate-x-1"
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

      {/* Add these styles to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
      `}</style>
    </div>
  );
};