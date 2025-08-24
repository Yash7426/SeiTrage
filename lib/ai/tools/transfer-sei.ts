import { tool } from 'ai';
import { z } from 'zod';
import axios from 'axios';

export const MCP_SERVER_URL = "https://sei-mcp-server-t923.onrender.com";

export const transferSei = tool({
  description: 'Transfer native SEI tokens to a given address on a specified network',
  parameters: z.object({
    to: z.string().describe('Recipient address'),
    amount: z.string().describe('Amount of tokens to send'),
    network: z.string().describe('Network identifier (e.g., testnet, mainnet)'),
  }),
  execute: async ({ to, amount, network }) => {
    try {
      console.log("Calling MCP server for transfer...");
      const response = await axios.post(`${MCP_SERVER_URL}/transfer`, {
        to,
        amount,
        network,
      });
      console.log("Transfer Response:", response.data);
      return response.data; 
    } catch (err: any) {
      console.error("Error in transferSei:", err);
      return { error: err.message };
    }
  },
});
