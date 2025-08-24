"use client";
import { signIn, useSession } from "next-auth/react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const SUPPORTED_NETWORKS: Record<number, { name: string; hex: string }> = {
  1: { name: "Ethereum Mainnet", hex: "0x1" },
  137: { name: "Polygon", hex: "0x89" },
  1329: { name: "Sei Mainnet", hex: "0x531" },
  10000027: { name: "Sei Testnet", hex: "0x5F5E101" },
};

// 🚀 Sei Testnet RPC endpoint
const SEI_TESTNET_RPC = "https://evm-rpc-testnet.sei-apis.com";

// ✅ Fetch Sei Testnet balance (read-only)
async function getSeiTestnetBalance(address: string) {
  const seiProvider = new ethers.JsonRpcProvider(SEI_TESTNET_RPC);
  const balance = await seiProvider.getBalance(address);
  return ethers.formatEther(balance).toString();
}

async function switchNetwork(targetChainId: number) {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SUPPORTED_NETWORKS[targetChainId].hex }],
    });
    console.log(`Switched to ${SUPPORTED_NETWORKS[targetChainId].name}`);
  } catch (error: any) {
    if (error.code === 4902) {
      alert("This chain is not added to MetaMask. Please add it manually.");
    } else {
      console.error("Failed to switch network:", error);
    }
    throw error;
  }
}

async function onSignInWithMetaMask() {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask first.");
      return;
    }

    // connect via MetaMask (ETH / Polygon)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    let chainId = Number(network.chainId);

    // Auto switch if unsupported
    if (!SUPPORTED_NETWORKS[chainId]) {
      const targetChainId = 1; // default ETH
      await switchNetwork(targetChainId);
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const newNetwork = await newProvider.getNetwork();
      chainId = Number(newNetwork.chainId);
    }

    console.log("Connected chainId:", chainId, SUPPORTED_NETWORKS[chainId].name);

    const signer = await provider.getSigner();
    const publicAddress = await signer.getAddress();

    // ✅ fetch Sei Testnet balance
    const seiBalance = await getSeiTestnetBalance(publicAddress);
    console.log("Sei Testnet Balance:", seiBalance);

    // send to backend
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicAddress, seiBalance }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch nonce: ${text}`);
    }

    const { nonce } = await response.json();
    const signedNonce = await signer.signMessage(nonce);

    await signIn("crypto", {
      seiBalance,
      publicAddress,
      signedNonce,
      callbackUrl: "/chat",
    });
  } catch (error) {
    console.error("Error during MetaMask sign-in:", error);
    alert("Error during MetaMask sign-in. Please try again.");
  }
}

export default function Login() {
  const session = useSession();
  console.log("Session status:", session.status);

  return (
    <main>
      <h1 className="font-bebas text-[20px] text-white border px-4 py-2 bg-[#9E1F19] transition duration-300 ease-in-out hover:bg-white hover:border-black hover:text-black">
        <button onClick={onSignInWithMetaMask}>CONNECT WALLET</button>
      </h1>
    </main>
  );
}
