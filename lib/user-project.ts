import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";

export const createUserProject = async (messages: any) => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  // const userProject = await prismadb.userProject.findUnique({
  //   where: {
  //     userId,
  //   },
  // });
  console.log(messages, 'messages')

    let results = await prismadb.userProject.create({
      data: {
        userId,
        name: "My Project",
        desc: "My Projectttt"
      },
    });
    return results;
};



export const getUserProjects = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }
  const projects = await prismadb.userProject.findMany({
    where: {
      userId,
    },
  });

  if (!projects) {
    return null;
  } else {
    return projects;
  }
};
