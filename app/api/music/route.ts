import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const config = {
  api: {
    bodyParser: false, 
  }
};

const getBuffer = async (readableStream: any) => {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
      const file = (await req.formData()).get('audio') as File;
      if (!file) {
        return new NextResponse("No file found", { status: 400 });
      }

      const buffer = await getBuffer(file.stream());
      const base64 = buffer.toString("base64");
      const mimeType = "audio/*";
      const dataURI = `data:${mimeType};base64,${base64}`;

      const response = await replicate.run("cjwbw/demucs:25a173108cff36ef9f80f854c162d01df9e6528be175794b81158fa03836d953", {
        input: {
          audio: dataURI
        }
      });
      if (!response) {
        console.error('Empty response from replicate.run');
        return new NextResponse("No response from model", { status: 500 });
      }

      const isAllowed = await checkApiLimit();
      const isPro = await checkSubscription();
      
      if (!isAllowed && !isPro) {
        return new NextResponse("API Limit Exceeded", { status: 403 });
      }
      
      if (!isPro) {
        await increaseApiLimit();
      }
      
      return NextResponse.json(response, { status: 200 });
    } catch (error) {
    console.error("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}