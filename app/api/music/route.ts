import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import Replicate from "replicate";
import { writeFile } from 'fs/promises';
import busboy from 'busboy';
import { NextApiRequest, NextApiResponse } from "next";
import multer from 'multer';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const config = {
  api: {
    bodyParser: false, // Disabling Next.js' built-in body parser since we're using multer
  },
};
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });


export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // const file = (await req.formData()).get('audio');
      // console.log("FILE", file)
  
      // Function to get the audio file from req and send it to the response as an audio file
      const sendAudioFile = async (req: NextRequest, res: NextResponse) => {
        try {
          const { userId } = auth();
          if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
          }
          const file = (await req.formData()).get('audio');
          if (!file) {
            return new NextResponse("No file found", { status: 400 });
          }
          const buffer = await (file as File);
          console.log(buffer)
          const response = await replicate.run("cjwbw/demucs:25a173108cff36ef9f80f854c162d01df9e6528be175794b81158fa03836d953", {
            input: {
              audio: buffer,
            },
          });
          if (!response) {
            console.error('Empty response from replicate.run');
            return new NextResponse("No response from model", { status: 500 });
          }
        } catch (error) {
          console.error("[MUSIC_ERROR]", error);
          return new NextResponse("Internal Server Error", { status: 500 });
        }
      }

      sendAudioFile(req, res);
       
      const isAllowed = await checkApiLimit();
      const isPro = await checkSubscription();
      
      if (!isAllowed && !isPro) {
        return new NextResponse("API Limit Exceeded", { status: 403 });
      }
      
      // const response = await replicate.run("cjwbw/demucs:25a173108cff36ef9f80f854c162d01df9e6528be175794b81158fa03836d953", {
      //   input: {
      //     audio: "buffer",
      //   },
      // });
      
      // if (!response) {
      //   console.error('Empty response from replicate.run');
      //   return new NextResponse("No response from model", { status: 500 });
      // }
      
      if (!isPro) {
        await increaseApiLimit();
      }
      
      return NextResponse.json("response", { status: 200 });

  } catch (error) {
    console.error("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}