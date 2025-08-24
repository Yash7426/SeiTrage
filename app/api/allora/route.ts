import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const apiKey = process.env.ALLORA_API_KEY;
  const { searchParams } = new URL(req.url);

  const val = searchParams.get("val"); // only one value at a time

  if (!val) {
    return NextResponse.json(
      { error: "val is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://allora-api.testnet.allora.network/emissions/v7/latest_network_inferences/${val}`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": apiKey ?? "",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Allora API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch from Allora API" },
      { status: 500 }
    );
  }
}
