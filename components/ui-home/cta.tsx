import React from "react";
import Butn from "./butn";
import { useTransform, type MotionValue, motion } from "framer-motion";

interface CtaProps {
  scrollYProgress: MotionValue<number>;
}

const Cta: React.FC<CtaProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <motion.div
      // style={{ scale, rotate }}
      style={{
        backgroundImage: "url('/images/fade_logo.svg')",
        backgroundSize: "40%",
        backgroundPosition: "0 60%",
        backgroundRepeat: "no-repeat",
      }}
      className="h-[120vh] bg-[#111111] flex flex-col items-center justify-center gap-[6vh]"
    >
      <div className="font-montBold text-[100px] text-white text-center flex flex-col items-center leading-[120px]">
        <h1 className="flex flex-row">
          TRADE SMARTER<span className="text-[#9E1F19]">.</span>
        </h1>
        <h1 className="flex flex-row">
          MOVE FASTER<span className="text-[#9E1F19]">.</span>
        </h1>
        <h1 className="flex flex-row">
          STAY AHEAD<span className="text-[#9E1F19]">.</span>
        </h1>
      </div>
      <Butn />
    </motion.div>
  );
};

export default Cta;
