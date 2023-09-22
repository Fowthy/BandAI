import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import Replicate from "replicate";
import { writeFile } from 'fs/promises'
import multer from 'multer';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const config = {
  api: {
    bodyParser: false, // Disabling Next.js' built-in body parser since we're using multer
  },
};

interface MulterRequest extends NextRequest {
  file: any;
}

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage }).single('audio'); // 'audio' should match the key you used to append the file in FormData

export async function POST(req: MulterRequest, res: NextResponse) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    upload(req as any, res as any, async (err) => {
      if (err) {
        // return res.status(500).json({ error: err.message });
      }
      console.log(req, 'req.file') 
      const file = req.file;
      // const data = await req.formData();
      // const file: File | null = data.get('audio') as unknown as File;
      
      // if (!file) {
      //   return NextResponse.json({ success: false });
      // }

      // const bytes = await file.arrayBuffer();
      // const buffer = Buffer.from(bytes);
      
      // const path = `/tmp/${file.name}`;
      // // let a = await writeFile(path, buffer)
      // console.log('a???/');

      console.log(file,typeof file, 'aaaaaa')
      const isAllowed = await checkApiLimit();
      const isPro = await checkSubscription();
      
      if (!isAllowed && !isPro) {
        return new NextResponse("API Limit Exceeded", { status: 403 });
      }
      
      const response = await replicate.run("cjwbw/demucs:25a173108cff36ef9f80f854c162d01df9e6528be175794b81158fa03836d953", {
        input: {
          audio: req,
        },
      });
      
      if (!response) {
        console.error('Empty response from replicate.run');
        return new NextResponse("No response from model", { status: 500 });
      }
      
      if (!isPro) {
        await increaseApiLimit();
      }
      
      return NextResponse.json(response, { status: 200 });
    })

  } catch (error) {
    console.error("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}