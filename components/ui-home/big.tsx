import { motion, useTransform, type MotionValue } from "framer-motion";
import React from "react";

interface BigProps {
  scrollYProgress: MotionValue<number>;
}

const Big: React.FC<BigProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <motion.div
      // style={{ scale, rotate }}
      className="h-[120vh] bg-[#111111] text-white text-[90px] leading-[110px] flex font-montBold justify-center text-center items-center"
    >
      <h1 className="w-[50%]">
        THE FUTURE BELONGS TO THOSE WHO PREDICT IT{" "}
        <span className="text-[#9E1F19]">FIRST.</span>
      </h1>
    </motion.div>
  );
};

export default Big;
