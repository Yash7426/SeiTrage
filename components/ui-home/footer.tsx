import { useTransform, type MotionValue, motion } from "framer-motion";
import React from "react";
import Image from "next/image";

interface FooterProps {
  scrollYProgress: MotionValue<number>;
}

const Footer: React.FC<FooterProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <motion.div
      // style={{ scale, rotate }}
      className="h-[100vh] text-[150px] flex justify-evenly flex-col items-center font-montBold text-[#9E1F19]"
    >
      <div className="flex flex-col items-center">
        <Image
          src={"/images/seitrage_logo_black_grain.svg"}
          alt="."
          width={300}
          height={300}
        />
        <div className="flex flex-row leading-[150px]">SEI <p className="text-black leading-[150px]">TRAGE</p></div>
      </div>
      <div className="font-montLight text-[14px] align-baseline text-black">@SEITRAGE 2025</div>
    </motion.div>
  );
};

export default Footer;
