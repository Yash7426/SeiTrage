import React, { useRef } from "react";
import Image from "next/image";
import { useTransform, motion, type MotionValue, useScroll } from "framer-motion";

interface FeaturesProps {
  scrollYProgress: MotionValue<number>;
}

const Features: React.FC<FeaturesProps> = ({ scrollYProgress }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Track when the section is near the top
  const { scrollYProgress: sectionScroll } = useScroll({
    target: ref,
    offset: ["start start", "end start"], // Start rotation when it touches the top
  });

  // Rotate the section only when it reaches the top
  const rotate = useTransform(sectionScroll, [0.3, 1], [0, -5]); // Rotates between 30% to 100% scroll

  return (
    <motion.div
      ref={ref}
      // style={{ rotate }}
      className="h-[100vh] bg-white flex flex-col py-[8vh] px-[5vw] gap-[6vh]"
    >
      <div className="flex flex-row justify-between">
        <div className="font-marvin text-[30px] flex flex-row items-center gap-2">
        <Image src="/images/seitrage_logo.svg" alt="sei" width={50} height={50} />
        </div>
        <h1 className="font-montBold text-[70px]">FEATURES</h1>
      </div>
      <Image
        src="/images/features.svg"
        alt="features"
        width={1100}
        height={1100}
        className="flex self-end"
      />
    </motion.div>
  );
};

export default Features;
