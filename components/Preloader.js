import React, { useEffect, useState } from "react";
import { BiRadar } from "react-icons/bi";
import { motion } from "framer-motion";
function Preloader() {
  const [loaded, setLoaded] = useState(false);

  const resetLoading = () => {
    setLoaded(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => resetLoading(), 6000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={
        loaded
          ? "hidden"
          : "relative left-0 top-0 z-[60]  flex h-[100vh] w-screen items-center justify-center  overflow-hidden bg-black transition-all"
      }
    >
      <div className="flex-col">
        <div className="flex items-center">
          <motion.div
            initial={{
              opacity: 0,
              translateX: 500,
            }}
            animate={{
              opacity: 1,
              translateX: 0,
            }}
            transition={{
              duration: 1.5,
            }}
          >
            <BiRadar className="text-gray-100 text-[80px]" />
          </motion.div>
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 2,
              delay: 0.3,
            }}
            className="text-yellow-500 font-serif text-[50px] ml-[5px]"
          >
            November<span className="text-white"> Romeo</span>
          </motion.p>
        </div>

        <div className="mt-10">
          <p className="text-gray-100 font-serif text-[16px] text-center animate-pulse">
            Educational Flight tracker
          </p>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
