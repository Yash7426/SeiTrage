import { tool } from 'ai';
import { z } from 'zod';
// import { callTool } from '@/lib/mcp/client';
import axios from 'axios';

const MCP_SERVER_URL = "http://localhost:3001";

export const getBalance = tool({
  description: 'Get the native token balance for an address on a given network',
  parameters: z.object({
    address: z.string(),
    network: z.string(),
  }),
  execute: async ({ address, network }) => {
    console.log("aaya kya bete")
    // const response = await callTool('get-balance', { address, network });
    const verifyRes = await axios.post(`${MCP_SERVER_URL}/balance`, {
      address,network
    });
    console.log("yash",verifyRes)
    return verifyRes;
  },
});