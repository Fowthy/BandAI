import LandingContent from "@/components/landing-content";
import { LandingHero } from "@/components/landing-hero";
import { LandingNabvbar } from "@/components/landing-navbar";
import Link from "next/link";

function LandingPage() {
  return (
    <div className="h-full">
      <p>Very good projects</p>


      <Link href="/dashboard/project1" className="p-2 w-full bg-red-400">
        Project 1
      </Link>

    </div>
  );
}

export default LandingPage;
