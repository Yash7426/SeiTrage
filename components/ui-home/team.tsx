import React from "react";
import TeamCard from "./team-card";
import { useTransform, type MotionValue, motion } from "framer-motion";
import Image from "next/image";

interface TeamProps {
  scrollYProgress: MotionValue<number>;
}

const Team: React.FC<TeamProps> = ({ scrollYProgress }) => {

  return (
    <motion.div
      // style={{ scale, rotate }}
      
      className="h-[100vh] bg-white flex flex-col gap-[15vh] py-[10vh] px-[10vh]"
    >
      <div className='flex flex-row justify-between'>
        <div className="font-montBold text-[70px]">TEAM MEMBERS</div>
        <Image src="/images/seitrage_logo.svg" alt="sei" width={50} height={50} />
      </div>
      
      <div className="flex gap-[4vh] flex-col">
        <div className="text-[16px] w-[40%] font-montRegular">
          We are a passionate team of blockchain enthusiasts, AI engineers, and Web developers committed to transforming decentralized trading. Our mission is to empower traders with AI-driven insights, eliminate inefficiencies in decentralized markets, and push the boundaries of financial technology.
        </div>
        <div className="flex flex-row justify-between">
          <TeamCard name="Yash Kudnar" posi="Blockchain Developer" img="aviral" />
          <TeamCard name="Mayank Rawat" posi="Web Developer" img="mayank" />
          <TeamCard name="Darsh Baxi" posi="AI Developer" img="darsh" />
          <TeamCard name="Aviral Hatwal" posi="Blockchain Developer" img="kudnar" />
          <TeamCard name="Yash Agarwal" posi="Web Developer" img="yash" />
        </div>
      </div>
    </motion.div>
  );
};

export default Team;
