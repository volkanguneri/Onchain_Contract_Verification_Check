import { BasescanCheckUI } from "./_components/BasescanCheckUI";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Check if a contract is verified on Etherscan",
  description: "Prompt the address that shoud be checked on Etherscan",
});

const BasescanCheck: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 min-w-[320px]">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Basescan Verification Check</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">
              Please check if a contract is verified on Basescan before any interaction
            </p>
          </div>
        </div>
        <BasescanCheckUI />
      </div>
    </>
  );
};

export default BasescanCheck;
