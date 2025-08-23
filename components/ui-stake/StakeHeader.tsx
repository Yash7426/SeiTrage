"use client"
import { useState, } from "react";
import { MoveRight } from "lucide-react";
import StakeCard from "./stake-token";
import { ethers, BrowserProvider, Contract } from "ethers";
import { abi, address } from "@/contracts_abi/Staking.json";
import { toast } from "sonner";
import { abi1, address1 } from "@/contracts_abi/Staking1.json";

const STAKE_CHAIN_ID = 1328; // ✅ Sei Testnet chainId

const StakeHeader: React.FC = () => {
  const stakeTokens = [
    {
      icon: "https://assets.coingecko.com/coins/images/38591/standard/iSEI_logo_200_200.png?1718091709",
      name: "Silo",
      symbol: "iSEI",
      change: "+18.1%",
    },
    {
      icon: "https://assets.coingecko.com/coins/images/31252/standard/Kryptonite_PFP-03.png?1696530076",
      name: "Kryptonite",
      symbol: "stSEI",
      change: "+48.4%",
    }
  ];

  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const handleSelectToken = (name: string) => {
    setSelectedToken(name);
  };

  function listenForTransactionMined(transactionResponse: any, provider: any) {
    return new Promise((resolve) => {
      provider.once(transactionResponse.hash, (transactionReceipt: any) => {
        resolve(transactionReceipt);
      });
    });
  }

  async function ensureSeiChain(provider: BrowserProvider) {
    const network = await provider.getNetwork();
    console.log("Connected to chain:", network.chainId.toString());

    if (Number(network.chainId) !== STAKE_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x530" }], 
        });
        toast.success("Switched to Sei Testnet");
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x530",
                chainName: "Sei Testnet",
                rpcUrls: ["https://evm-rpc-testnet.sei-apis.com"],
                nativeCurrency: {
                  name: "Sei",
                  symbol: "SEI",
                  decimals: 18, 
                },
                blockExplorerUrls: ["https://testnet.seiscan.app"],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
    }
  }

  async function enter() {
    try {
      console.log("hello1")
      if (window.ethereum) {
        console.log("hello")
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        await ensureSeiChain(provider); // ✅ check chain

        const signer = await provider.getSigner();
        const contract = new Contract(address, abi, signer);

        const toastId = toast.loading("Staking in progress...");
        const transactionResponse = await contract.stake({
          value: ethers.parseEther(amount) 
        });

        await listenForTransactionMined(transactionResponse, provider);

        toast.success("Successfully staked token.", { id: toastId });
        setAmount("0");
        setSelectedToken(null);
      }
    } catch (e) {
      console.error(e);
      toast.error("Staking failed.");
    }
  }

  async function enter1() {
    try {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        await ensureSeiChain(provider); // ✅ check chain

        const signer = await provider.getSigner();
        const contract = new Contract(address1, abi1, signer);

        const toastId = toast.loading("Staking in progress...");
        const transactionResponse = await contract.stake({
          value: ethers.parseUnits(amount, 6),
        });

        await listenForTransactionMined(transactionResponse, provider);

        toast.success("Successfully staked token.", { id: toastId });
        setAmount("0");
        setSelectedToken(null);
      }
    } catch (e) {
      console.error(e);
      toast.error("Staking failed.");
    }
  }

  const handleStake = () => {
    if (selectedToken && amount) {
      if (selectedToken === "Silo") {
        enter();
      } else if (selectedToken === "Origin Sonic") {
        enter1();
      }
    }
  };

  return (
    <div className="w-[90%] mx-auto my-4 rounded-lg">
      <h2 className="text-3xl my-4 font-marvin">LIQUIDITY TOKENS</h2>
      <hr className="border-[#E4E4E4] w-[90%] pb-4" />
      <h2 className="text-xl my-4 font-bold text-[#2D2D2D]">Search</h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search Tokens"
          className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-[#ffffff] focus:border-[#9E1F19]"
        />
        <MoveRight color="white" className="absolute inset-y-0 size-8 my-auto text-gray-400 right-4 border bg-[#9E1F19] rounded-full p-1" />
      </div>
      <h2 className="text-xl my-8 font-bold text-[#2D2D2D]">Tokens</h2>
      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full py-3 px-4 mb-4 text-gray-500 border rounded-md outline-none bg-[#ffffff] focus:border-[#9E1F19]"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6 max-w-7xl mx-auto">
        {stakeTokens.map((token, index) => (
          <div
            key={index}
            onClick={() => handleSelectToken(token.name)}
            className={`cursor-pointer rounded-lg ${selectedToken === token.name ? "border border-[#9E1F19]" : "border"}`}
          >
            <StakeCard {...token} />
          </div>
        ))}
      </div>
      <button
        onClick={handleStake}
        className="w-full mt-6 py-3 bg-[#9E1F19] text-white font-bold rounded-md hover:bg-[#9f443f]"
      >
        Stake
      </button>
    </div>
  );
};

export default StakeHeader;