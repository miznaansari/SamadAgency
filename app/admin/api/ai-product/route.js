import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const image = await req.arrayBuffer();

    const response = await fetch(
      "https://api.theclevar.com/webhook/extract-info",
      {
        method: "POST",
        headers: {
          "Content-Type": "image/png",
        },
        body: image,
      }
    );

    const data = await response.json();
    console.log('aidatadata',data)

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        status: "false",
        data: { message: "AI request failed" },
      },
      { status: 500 }
    );
  }
}