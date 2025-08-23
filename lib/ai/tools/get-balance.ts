import { tool } from 'ai';
import { z } from 'zod';
import axios from 'axios';
import { MCP_SERVER_URL } from './transfer-sei';

export const getBalance = tool({
  description: 'Get the native token balance for an address on a given network',
  parameters: z.object({
    address: z.string(),
    network: z.string(),
  }),
  execute: async ({ address, network }) => {
  try {
    console.log("Calling MCP server...");
    const response = await axios.post(`${MCP_SERVER_URL}/balance`, { address, network });
    console.log("Response:", response.data);
    return response.data; // ✅ Only return the data
  } catch (err:any) {
    console.error("Error in getBalance:", err);
    return { error: err.message }; // ✅ Always return something
  }
}

});