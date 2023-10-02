import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";

export const createUserProject = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  // const userProject = await prismadb.userProject.findUnique({
  //   where: {
  //     userId,
  //   },
  // });

    await prismadb.userProject.create({
      data: {
        userId,
        name: "My Project",
        desc: "My Projectttt"
      },
    });
};



export const getUserProject = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
      id: "12345",
    },
  });

  if (!userApiLimit) {
    return null;
  } else {
    return userApiLimit;
  }
};
