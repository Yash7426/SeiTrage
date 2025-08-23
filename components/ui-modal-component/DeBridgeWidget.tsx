"use client";
declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useMemo, useState } from "react";
import { createWalletClient, custom } from "viem";
import { mainnet, polygon, sei } from "viem/chains";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";
import { debridge } from "@goat-sdk/plugin-debridge";

type ChainId = 1 | 137 | 100000027;

const ZERO = "0x0000000000000000000000000000000000000000";

const SEI = {
  id: 1329,
  name: "Sei (EVM)",
  nativeCurrency: { name: "Sei", symbol: "SEI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evm-rpc.sei-1329.testnet"] }, // replace with correct
  },
  blockExplorers: {
    default: { name: "Sei Explorer", url: "https://seiscan.app" },
  },
};
const SUPPORTED_CHAINS: Record<number, any> = {
  1: mainnet,
  137: polygon,
  1329: SEI, 
  100000027: sei,
};

// Minimal chain + token registry (expand as needed)
const CHAINS: Record<
  ChainId,
  { name: string; hex: `0x${string}`; tokens: { symbol: string; address: string; decimals: number }[] }
> = {
  1: {
    name: "Ethereum",
    hex: "0x1",
    tokens: [
      { symbol: "ETH", address: ZERO, decimals: 18 },
      { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
    ],
  },
  137: {
    name: "Polygon",
    hex: "0x89",
    tokens: [
      { symbol: "MATIC", address: ZERO, decimals: 18 },
      { symbol: "WETH", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", decimals: 18 },
      { symbol: "USDC.e", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6 },
    ],
  },
    100000027: {
    name: "Sei",
    hex: "0x531",
    tokens: [
      { symbol: "SEI", address: ZERO, decimals: 18 },
      { symbol: "WSEI", address: "0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7", decimals: 18 },
      { symbol: "USDC.e", address: "0xe15fc38f6d8c56af07bbcbe3baf5708a2bf42392", decimals: 6 },
    ],
  },
  
};

// Helpers
function toBaseUnits(amountStr: string, decimals: number): string {
  // robust decimal -> base units (no floating rounding)
  const [int, frac = ""] = amountStr.trim().split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  const raw = (int || "0") + fracPadded;
  // remove leading zeros
  const cleaned = raw.replace(/^0+/, "") || "0";
  return cleaned;
}

function fromBaseUnits(amount: string | number, decimals: number): number {
  const s = String(amount);
  if (decimals === 0) return Number(s);
  const pad = s.padStart(decimals + 1, "0");
  const head = pad.slice(0, -decimals);
  const tail = pad.slice(-decimals);
  return Number(`${head}.${tail}`.replace(/\.?0+$/, (m) => (m === "." ? "" : "")));
}

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [walletClient, setWalletClient] = useState<any>(null);
  const [tools, setTools] = useState<any>(null);

  const [srcChainId, setSrcChainId] = useState<ChainId>(1);
  const [dstChainId, setDstChainId] = useState<ChainId>(137);

  const [srcTokenAddr, setSrcTokenAddr] = useState<string>(CHAINS[1].tokens[0].address); // ETH
  const [dstTokenAddr, setDstTokenAddr] = useState<string>(CHAINS[137].tokens[0].address); // WETH

  const [amount, setAmount] = useState<string>(""); // human units
  const [quote, setQuote] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [approving, setApproving] = useState(false);
  const [executing, setExecuting] = useState(false);

  const srcTokenMeta = useMemo(
    () => CHAINS[srcChainId].tokens.find((t) => t.address.toLowerCase() === srcTokenAddr.toLowerCase())!,
    [srcChainId, srcTokenAddr]
  );
  const dstTokenMeta = useMemo(
    () => CHAINS[dstChainId].tokens.find((t) => t.address.toLowerCase() === dstTokenAddr.toLowerCase())!,
    [dstChainId, dstTokenAddr]
  );

  // Connect Wallet + load deBridge tools
  async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not found!");
    return;
  }

  const [address] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  setAccount(address);

  const chainIdHex: string = await window.ethereum.request({
    method: "eth_chainId",
  });
  const chainId = Number.parseInt(chainIdHex, 16);

  const chain = SUPPORTED_CHAINS[chainId];
  if (!chain) {
    alert(`Unsupported chainId: ${chainId}`);
    return;
  }

  const client = createWalletClient({
    chain,
    transport: custom(window.ethereum),
  });
  setWalletClient(client);

  const t = await getOnChainTools({
    wallet: viem(client),
    plugins: [debridge()],
  });
  setTools(t);
  console.log("🔧 Tools loaded", t);
}

  // Switch network in MetaMask to the selected source chain (before approve/execute)
  async function switchToSrcChain() {
  if (!window.ethereum) return;
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: CHAINS[srcChainId].hex }],
  });

  // 🔄 Recreate client with the new chain
  // const chain = SUPPORTED_CHAINS[srcChainId];
  // const client = createWalletClient({
  //   chain,
  //   transport: custom(window.ethereum),
  // });
  // setWalletClient(client);
}

async function handleSwap() {
  try {
    if (!account) {
      await connectWallet();
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount > 0");
      return;
    }

    // Step 1: Get Quote
    const baseAmount = toBaseUnits(amount, srcTokenMeta.decimals);
    const q = await tools.get_bridge_quote.execute({
      srcChainId,
      dstChainId,
      srcChainTokenIn: srcTokenAddr,
      dstChainTokenOut: dstTokenAddr,
      srcChainTokenInAmount: baseAmount,
      receiverAddress: account!,
    });
    setQuote(q);

    // Step 2: Create Order
    const o = await tools.create_bridge_order.execute({
      srcChainId: q.estimation.srcChainTokenIn.chainId,
      dstChainId: q.estimation.dstChainTokenOut.chainId,
      srcChainTokenIn: q.estimation.srcChainTokenIn.address,
      dstChainTokenOut: q.estimation.dstChainTokenOut.address,
      srcChainTokenInAmount: q.estimation.srcChainTokenIn.amount,
      dstChainTokenOutRecipient: account,
      senderAddress: account,
      srcChainOrderAuthorityAddress: account,
    });
    setOrder(o);

    // Step 3: Approve if ERC-20
    if (srcTokenAddr !== ZERO) {
      const spender = q?.tx?.allowanceTarget;
      if (spender) {
        await tools.approve_token_evm.execute({
          token: srcTokenAddr,
          spender,
          amount: q.estimation.srcChainTokenIn.amount,
        });
        console.log("✅ Approval done");
      }
    }

    // Step 4: Execute TX
    await switchToSrcChain();
    const isNative = srcTokenAddr === ZERO;
    const valueToSend = isNative ? BigInt(o.tx.value ?? "0") : 0n;

    const txHash = await walletClient.sendTransaction({
      account,
      to: o.tx.to as `0x${string}`,
      data: o.tx.data as `0x${string}`,
      value: valueToSend,
    });

    console.log("✅ Swap TX Sent:", txHash);
    alert(`Swap submitted: ${txHash}`);
  } catch (err) {
    console.error("❌ Swap failed:", err);
    alert("Swap failed. See console for details.");
  }
}

  // Get Quote
  async function getBridgeQuote() {
    if (!tools) return alert("Connect wallet first!");
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount > 0");

    const baseAmount = toBaseUnits(amount, srcTokenMeta.decimals);

    const q = await tools.get_bridge_quote.execute({
      srcChainId,
      dstChainId,
      srcChainTokenIn: srcTokenAddr,
      dstChainTokenOut: dstTokenAddr,
      srcChainTokenInAmount: baseAmount,
      receiverAddress: account!,
    });

    setQuote(q);
    setOrder(null);
    console.log("🔍 Quote:", q);
  }

  // Create Order
  async function createBridgeOrder() {
    if (!tools || !quote) return alert("Get a quote first!");
    if (!account) return alert("Wallet not connected!");

    const o = await tools.create_bridge_order.execute({
      srcChainId: quote.estimation.srcChainTokenIn.chainId,
      dstChainId: quote.estimation.dstChainTokenOut.chainId,
      srcChainTokenIn: quote.estimation.srcChainTokenIn.address,
      dstChainTokenOut: quote.estimation.dstChainTokenOut.address,
      srcChainTokenInAmount: quote.estimation.srcChainTokenIn.amount,
      dstChainTokenOutRecipient: account,
      senderAddress: account,
      srcChainOrderAuthorityAddress: account,
    });

    setOrder(o);
    console.log("📝 Order:", o);
  }

  // (Optional) Approve ERC-20 if source token is not native
  async function approveIfNeeded() {
    if (!tools || !quote) return;
    if (srcTokenAddr === ZERO) {
      alert("Native token (no approval required).");
      return;
    }
    try {
      setApproving(true);
      await switchToSrcChain();
      // spender from quote.tx.allowanceTarget (when approval is required)
      const spender = quote?.tx?.allowanceTarget;
      if (!spender) {
        alert("No allowance target in quote. Approval might not be required.");
        return;
      }
      await tools.approve_token_evm.execute({
        token: srcTokenAddr,
        spender,
        // approve exact input amount in base units
        amount: quote.estimation.srcChainTokenIn.amount,
      });
      alert("Approval transaction sent (check wallet).");
    } catch (e) {
      console.error(e);
      alert("Approval failed (see console).");
    } finally {
      setApproving(false);
    }
  }

  // Execute Bridge TX
  async function executeTx() {
  if (!walletClient || !order) return alert("Create order first!");
  try {
    setExecuting(true);
    await switchToSrcChain();

    // ✅ Only pass value if source token is native (ETH, MATIC, SEI, etc.)
    const isNative = srcTokenAddr === ZERO;
    const valueToSend = isNative ? BigInt(order.tx.value ?? "0") : 0n;

    const txHash = await walletClient.sendTransaction({
      account,
      to: order.tx.to as `0x${string}`,
      data: order.tx.data as `0x${string}`,
      value: valueToSend,
    });

    console.log("✅ TX Sent:", txHash);
    alert(`Transaction submitted: ${txHash}`);
  } catch (err) {
    console.error("❌ Execute failed:", err);
    alert("Transaction failed. See console for details.");
  } finally {
    setExecuting(false);
  }
}


  // UI bits
  const srcTokens = CHAINS[srcChainId].tokens;
  const dstTokens = CHAINS[dstChainId].tokens;

  // Quote breakdown (safe reads)
  const sendAmtHuman =
    quote ? fromBaseUnits(quote.estimation.srcChainTokenIn.amount, srcTokenMeta.decimals) : 0;
  const recvAmtHuman =
    quote ? fromBaseUnits(quote.estimation.dstChainTokenOut.amount, dstTokenMeta.decimals) : 0;

  const usdIn = quote?.estimation?.srcChainTokenIn?.approximateUsdValue ?? null;
  const usdOut = quote?.estimation?.dstChainTokenOut?.approximateUsdValue ?? null;

  // const protocolFeeEth =
  //   quote?.fixFee && srcTokenMeta.decimals
  //     ? Number((BigInt(quote.fixFee) * BigInt(10 ** Math.max(0, 18 - srcTokenMeta.decimals))).toString()) / 1e18
  //     : null;
    // ===== CORRECT PROTOCOL FEE CALCULATION =====
  // Treat quote.fixFee as wei (1e18) and convert to native human units:
  const protocolFeeEth = quote?.fixFee ? Number(BigInt(quote.fixFee)) / 1e18 : null;

  // Find native token symbol for the src chain (token with ZERO address)
  const nativeSymbol = CHAINS[srcChainId].tokens.find((t) => t.address === ZERO)?.symbol ?? "native";

  const operatingExpenseEth =
    quote?.estimation?.srcChainTokenIn?.approximateOperatingExpense
      ? Number(quote.estimation.srcChainTokenIn.approximateOperatingExpense) / 1e18
      : null;

  return (
    <div className="max-h-[80vh] h-full bg-black text-white p-4 overflow-y-scroll min-w-md rounded-2xl">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">🌉 deBridge Widget</h1>

        {/* Connect */}
        {!account ? (
          <button
            onClick={connectWallet}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-sm opacity-80">✅ Connected: {account}</div>
        )}

        {/* Widget Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
          {/* Row: From */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="text-xs uppercase opacity-70">From Chain</label>
              <select
                value={srcChainId}
                onChange={(e) => {
                  const id = Number(e.target.value) as ChainId;
                  setSrcChainId(id);
                  // default to first token of that chain
                  setSrcTokenAddr(CHAINS[id].tokens[0].address);
                }}
                className="w-full mt-1 bg-neutral-800 text-white rounded px-3 py-2"
              >
                {(Object.keys(CHAINS) as unknown as ChainId[]).map((id) => (
                  <option key={id} value={id} className="text-white">
                    {CHAINS[id].name} (Chain {id})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="text-xs uppercase opacity-70">From Token</label>
              <select
                value={srcTokenAddr}
                onChange={(e) => setSrcTokenAddr(e.target.value)}
                className="w-full mt-1 bg-neutral-800 text-white rounded px-3 py-2"
              >
                {srcTokens.map((t) => (
                  <option key={t.address} value={t.address} className="text-white">
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="text-xs uppercase opacity-70">Amount</label>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                className="w-full mt-1 bg-white text-black rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Row: To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="col-span-1">
              <label className="text-xs uppercase opacity-70">To Chain</label>
              <select
                value={dstChainId}
                onChange={(e) => {
                  const id = Number(e.target.value) as ChainId;
                  setDstChainId(id);
                  setDstTokenAddr(CHAINS[id].tokens[0].address);
                }}
                className="w-full mt-1 bg-neutral-800 text-white rounded px-3 py-2"
              >
                {(Object.keys(CHAINS) as unknown as ChainId[]).map((id) => (
                  <option key={id} value={id} className="text-white">
                    {CHAINS[id].name} (Chain {id})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="text-xs uppercase opacity-70">To Token</label>
              <select
                value={dstTokenAddr}
                onChange={(e) => setDstTokenAddr(e.target.value)}
                className="w-full mt-1 bg-neutral-800 text-white rounded px-3 py-2"
              >
                {dstTokens.map((t) => (
                  <option key={t.address} value={t.address} className="text-white">
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            {/* <button
              onClick={getBridgeQuote}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500"
            >
              Get Quote
            </button> */}

            {/* <button
              onClick={createBridgeOrder}
              disabled={!quote}
              className={`px-4 py-2 rounded ${
                quote ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-yellow-900 text-neutral-400 cursor-not-allowed"
              }`}
            >
              Create Order
            </button> */}

            {/* <button
              onClick={approveIfNeeded}
              disabled={!quote || srcTokenAddr === ZERO || approving}
              className={`px-4 py-2 rounded ${
                !quote || srcTokenAddr === ZERO
                  ? "bg-neutral-800 text-neutral-400 cursor-not-allowed"
                  : "bg-sky-400 text-black hover:bg-sky-300"
              }`}
            >
              {approving ? "Approving..." : "Approve (if ERC-20)"}
            </button> */}

            {/* <button
              onClick={executeTx}
              disabled={!order || executing}
              className={`px-4 py-2 rounded ${
                order ? "bg-red-600 text-white hover:bg-red-500" : "bg-neutral-800 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {executing ? "Executing..." : "Execute TX"}
            </button> */}

            <button
  onClick={handleSwap}
  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500"
>
  Swap
</button>

          </div>
        </div>

        {/* Quote Card */}
        {quote && (
          <div className="bg-white text-black rounded-xl p-4 space-y-2 shadow mt-2">
            <h2 className="text-lg font-semibold">Bridge Quote</h2>
            <p>
              <b>From:</b> {srcTokenMeta.symbol} (Chain {srcChainId}) →{" "}
              <b>To:</b> {dstTokenMeta.symbol} (Chain {dstChainId})
            </p>
            <p>
              <b>Send:</b> {sendAmtHuman.toFixed(6)} {srcTokenMeta.symbol}
              {usdIn != null ? ` (~$${Number(usdIn).toFixed(2)})` : ""}
            </p>
            <p>
              <b>Receive (est.):</b> {recvAmtHuman.toFixed(6)} {dstTokenMeta.symbol}
              {usdOut != null ? ` (~$${Number(usdOut).toFixed(2)})` : ""}
            </p>
            {protocolFeeEth != null && (
              <p>
                <b>Protocol Fee:</b> {protocolFeeEth.toFixed(6)}{nativeSymbol}
              </p>
            )}
            {operatingExpenseEth != null && (
              <p>
                <b>Gas/Execution Cost (deBridge side):</b> {operatingExpenseEth.toFixed(6)} ETH
              </p>
            )}
            <p>
              <b>Estimated Time:</b> {quote.order?.approximateFulfillmentDelay ?? "-"} min
            </p>
          </div>
        )}

        {/* Order Card */}
        {order && (
          <div className="bg-white text-black rounded-xl p-4 space-y-2 shadow">
            <h2 className="text-lg font-semibold">Bridge Order</h2>
            <p>
              <b>Order ID:</b> {order.orderId}
            </p>
            <p>
              <b>From:</b> {order.estimation.srcChainTokenIn.symbol} →{" "}
              <b>To:</b> {order.estimation.dstChainTokenOut.symbol}
            </p>
            <p>
              <b>Amount:</b>{" "}
              {fromBaseUnits(order.estimation.srcChainTokenIn.amount, srcTokenMeta.decimals).toFixed(6)}{" "}
              {order.estimation.srcChainTokenIn.symbol}
            </p>
            <p>
              <b>Receiver:</b> {account}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}