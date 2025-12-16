/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
export const Hero = () => {
  return (
    <div>
      {/* <Header /> */}
      <div className="mx-auto max-w-4xl h-[85vh] lg:h-[90vh] center px-2">
        <div className="animate-in mt-10 sm:mt-16">
          <h1 className="text-4xl md:text-5xl text-center font-black text-balance lg:text-6xl h1 mb-4">
            Rich Styled UI Components
          </h1>
          <p className="text-center text-pretty text-lg mb-4 dark:text-zinc-400 mx-auto">
            Make your website stand out with minimal effort.
            <span className="block">
              Built with{' '}
              <span className="dark:text-green-300 text-green-700 font-semibold">
                Reactjs
              </span>
              ,{' '}
              <span className="dark:text-green-300 text-green-700 font-semibold">
                shadcn
              </span>{' '}
              and{' '}
              <span className="dark:text-green-300 text-green-700 font-semibold">
                Framer Motion
              </span>{' '}
              for animation.
            </span>
          </p>
          <div className="flex-row-center gap-4 mx-auto max-w-fit py-4">
          
          </div>
        </div>
      </div>
    </div>
  );
};