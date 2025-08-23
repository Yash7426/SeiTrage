import { motion } from "framer-motion";
import Image from "next/image";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-8"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-2 md:p-4 flex flex-col gap-2 sm:gap-3 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-2 items-center">
          <Image src="/images/sei-logo.svg" alt="" height={100} width={100} />
        </p>
        <p>
          SeiTrage unites a lightning-fast collective of AI-driven DeFi agents
          on the Sei blockchain to pinpoint and execute arbitrage
          opportunities with unmatched speed and precision.
        </p>
      </div>
    </motion.div>
  );
};
