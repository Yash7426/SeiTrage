import { tool } from 'ai';
import { z } from 'zod';
import { callTool } from '@/lib/mcp/client';

export const getTokenInfo = tool({
  description: 'Get ERC20 token metadata for a given token address and network',
  parameters: z.object({
    tokenAddress: z.string(),
    network: z.string(),
  }),
  execute: async ({ tokenAddress, network }) => {
    const response = await callTool('get-token-info', {
      tokenAddress,
      network,
    });
    console.log(response)
    return response;
  },
});