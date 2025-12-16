// import { motion } from "framer-motion";
// import FloatingBackground from "../Ui/floatingBg";
// import { useState, useEffect, useRef } from "react";
// import DailyProblem from "../components/dailyProblem";
// import { useSelector } from "react-redux";
// import DailyProblemShimmer from "../shimmers/dailyProblemShimmer";
// import { Link } from "react-router";

// export default function Hero({sectionRef}) {
//   const {loading} = useSelector((state)=>state.dailyProblem);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   function scrollToSection() {
//     if (sectionRef && sectionRef.current) {
//       sectionRef.current.scrollIntoView({ behavior: 'smooth' });
//     }}

//   useEffect(() => {
   
    
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     window.addEventListener('resize', handleResize);
    
//     return () => {
//       clearInterval(interval);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-3 relative overflow-hidden">
      
//       {/* Floating animated elements */}
//       <motion.div 
//         initial={{ x: -100, y: -50, opacity: 0 }}
//         animate={{ x: 0, y: 0, opacity: 0.3 }}
//         transition={{ duration: 1.5, delay: 0.5 }}
//         className="absolute top-10 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-xl"
//       />
      
//       <motion.div 
//         initial={{ x: 100, y: 100, opacity: 0 }}
//         animate={{ x: 0, y: 0, opacity: 0.2 }}
//         transition={{ duration: 1.5, delay: 0.8 }}
//         className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-600/10 to-transparent blur-xl"
//       />

//       <div className="max-w-4xl w-full flex flex-col items-center justify-center text-center z-10 px-4">
//         <motion.div 
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="space-y-8 w-full"
//         >
        
           
          
//           <p className="text-lg text-gray-400 max-w-2xl mx-auto">
//             The platform that helps you <span className="text-green-300">solve problems</span>. 
//             Get <span className="text-indigo-400">AI-powered assistance</span>, different language support, 
//             and <span className="text-purple-400">competitive insights</span>.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
//             <Link to={'/problems'}>
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.98 }}
//               className="px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
//             >
//               Edit Now
//             </motion.button>
//             </Link>
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.98 }}
//               className="px-8 py-3 bg-gray-800/70 border border-gray-700 text-white font-medium rounded-lg hover:bg-gray-700/50 transition-all"
//               onClick={scrollToSection}
//             >
//               Explore
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }