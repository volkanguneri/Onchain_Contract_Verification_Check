import { VerificationCheckUI } from "./_components/VerificationCheckUI";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Check if a contract is verified on Etherscan",
  description: "Prompt the address that shoud be checked on Etherscan",
});

const VerificationCheck: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 min-w-[320px]">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Contract Verification Check</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Check on-chain contract verification</p>
          </div>
        </div>
        <VerificationCheckUI />
      </div>
    </>
  );
};

export default VerificationCheck;
