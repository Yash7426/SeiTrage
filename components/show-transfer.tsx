"use client";

import Image from "next/image";
import React from "react";

interface ShowTransferProps {
  network: string;
  sender: string;
  receiver: string;
  amount: string;
  hash:string;
}

const ShowTransfer: React.FC<ShowTransferProps> = ({
  sender,
  receiver,
  amount,
  network,
  hash
}) => {
  return (
    <div className="flex rounded-lg border-[1px] border-[#9E1F19] px-4 py-3 w-full">
      <div className="flex justify-between items-center w-full">
        {/* Sender */}
        <div className="flex items-center gap-2">
          <Image
            src={"/images/sei-logo.svg"}
            alt={network}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
          <div>
            <p className="text-sm font-bold text-gray-900 truncate max-w-[250px]">
              {sender}
            </p>
            <p className="text-xs font-semibold text-gray-600">{network}</p>
          </div>
        </div>

        {/* Swap + Amount in middle */}
        <div className="flex flex-col items-center justify-center gap-1">
          <Image
            src={"/images/forward-arrow.png"}
            alt="transfer"
            width={24}
            height={24}
            className="h-6 w-6 opacity-80"
          />
          <p className="text-sm font-bold">{amount} SEI</p>
        </div>

        {/* Receiver */}
        <div className="flex items-center gap-2">
          <Image
            src={"/images/sei-logo.svg"}
            alt={network}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
          <div>
            <p className="text-sm font-bold text-gray-900 truncate max-w-[250px]">
              {receiver}
            </p>
            <p className="text-xs font-semibold text-gray-600">{network}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowTransfer;
