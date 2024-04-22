import ContributionGraph from "@/components/github";
import GithubContributions from "@/components/github/contribution-graph";
import config from "@/config/config";
// import Image from "next/image";

export default function Home() {
  console.log();
  return (
    <div className="main-page-wrapper flex flex-col gap-6">
      <h1> Hello Home Page</h1>
      <div></div>
      <div className="mt-10 border-2 border-lime-100">
        {" "}
        <ContributionGraph
          username={config?.USERNAME}
          accessToken={config?.ACCESS_TOKEN}
        />
      </div>
    </div>
  );
}
