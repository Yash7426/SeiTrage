"use client";
import Image from "next/image";
import React from "react";

interface ShowBalanceProps {
  network: string;
  address: string;
  balance: string;
}

const ShowBalance: React.FC<ShowBalanceProps> = ({
address,balance,network
}) => {
  return (
    <div
      className="rounded-lg border-[1px] border-[#8902F4]"
    >
      <div className="flex px-4 py-2 items-center gap-2">
        <Image
          src={"/images/sei_logo.svg"}
          alt={network}
          width={100}
          height={100}
          className="rounded-full h-8 w-8"
        />
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col justify-center gap-y-[2px] w-full">
            <div className="flex justify-between w-full">
              <h2 className="font-bold text-lg font-marvin">
                {network}
                <span className="pl-1 text-purple-500">⭐</span>
              </h2>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-[2px] content-center">
                <span className="text-black font-semibold">{address}</span>
              </div>
            </div>
          </div>
          <div className="font-bold">{balance}</div>
        </div>
      </div>
    </div>
  );
};

export default ShowBalance;
