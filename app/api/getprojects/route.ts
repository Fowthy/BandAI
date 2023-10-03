import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

import { createUserProject, getUserProjects } from "@/lib/user-project";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAi = new OpenAIApi(configuration);

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if (!messages) {
    //   return new NextResponse("Missing messages", { status: 400 });
    // }

    const isAllowed = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!isAllowed && !isPro) {
      return new NextResponse("API Limit Exceeded", { status: 403 });
    }

    
    const response = await getUserProjects();
    console.log(response, "RESPONSE")

    // if (!isPro) {
    //   await increaseApiLimit();
    // }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("[PROJECT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
