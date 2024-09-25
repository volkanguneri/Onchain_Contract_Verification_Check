import { ScamHunterTokenUI } from "./_components/ScamHunterTokenUI";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "On Chain send AI request",
  description: "Prompt your request and send it on chain using ChainLink",
});

const ScamHunterToken: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 min-w-[320px]">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">ScamHunterToken</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Interacts only with verified contracts</p>
          </div>
        </div>
        <ScamHunterTokenUI />
      </div>
    </>
  );
};

export default ScamHunterToken;
