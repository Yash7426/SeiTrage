import { Client } from '@modelcontextprotocol/sdk/client';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {EventSource} from 'eventsource';
import {
  CallToolRequest,
  CallToolResultSchema,
  ListToolsRequest,
  ListToolsResultSchema,
} from '@modelcontextprotocol/sdk/types.js';

let client: Client | null = null;
let transport: StreamableHTTPClientTransport | null = null;

const MCP_BASE_URL = "http://localhost:3001/messages";
const MCP_SSE_URL = "http://localhost:3001/sse";

async function initClient() {
  if (client) return client;

  // 3️⃣ Create transport with sessionId
  transport = new StreamableHTTPClientTransport(
    new URL(`${MCP_BASE_URL}`)
  );

  // 4️⃣ Initialize client and connect transport
  client = new Client(
    { name: 'supersonic-next-client', version: '1.0.0' },
    {}
  );

  await client.connect(transport);
  console.log('✅ MCP client connected to transport');

  return client;
}

export async function callTool(toolName: string, args: Record<string, any>) {
  const cli = await initClient();

  const request: CallToolRequest = {
    method: 'tools/call',
    params: { name: toolName, arguments: args },
  };

  const result = await cli.request(request, CallToolResultSchema);
  return result.content;
}

export async function listTools() {
  const cli = await initClient();

  const request: ListToolsRequest = { method: 'tools/list', params: {} };
  const result = await cli.request(request, ListToolsResultSchema);
  return result.tools;
}