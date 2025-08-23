import React from "react";
import { useTransform, motion, type MotionValue } from "framer-motion";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

interface PoweredProps {
  scrollYProgress: MotionValue<number>;
}

const Powered: React.FC<PoweredProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  // build array of items dynamically
  const items = Array.from({ length: 10 }, (_, i) => ({
    url: `/images/s${i + 1}.svg`, // adjust path according to where your svgs are stored (public/images folder recommended)
  }));

  return (
    <motion.div
      style={{ scale }}
      
      className="h-[35vh] bg-white flex flex-col gap-10"
    >
      <div className="font-montMedium text-[30px] text-black text-center">
        POWERED BY
      </div>
      <InfiniteMovingCards items={items} />
    </motion.div>
  );
};

export default Powered;
