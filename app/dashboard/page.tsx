'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import  CreateProjectModal  from "@/components/create-project-modal";
import { useState } from "react";

function LandingPage() {

  const [hidden, setHidden] = useState(true);
  return (
    <div className="h-full">
      <p>Very good projects</p>
      <div className="m-auto h-full hidden justify-center items-center">
        <Button onClick={() => setHidden(false)}>Add new project</Button>
      </div>
      <div className="mt-11 grid grid-cols-6 gap-6">
      <Link href="/project1" className="p-2 w-full bg-red-400">
        Project 1
      </Link>
      <Link href="/project1" className="p-2 w-full bg-red-400">
        Project 1
      </Link>
      <Link href="/project1" className="p-2 w-full bg-red-400">
        Project 1
      </Link>

      <Button onClick={() => setHidden(false)} className="flex">Add new project</Button>

      </div>
      <CreateProjectModal hidden={hidden} setHidden={setHidden} name="DA"/>

    </div>
  );
}

export default LandingPage;
