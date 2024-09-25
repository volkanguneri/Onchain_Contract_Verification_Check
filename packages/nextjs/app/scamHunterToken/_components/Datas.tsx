import { Abi, AbiFunction } from "abitype";
import { ReadOnlyFunctionForm } from "~~/app/debug/_components/contract/ReadOnlyFunctionForm";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract/WriteOnlyFunctionForm";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const Datas = ({
  deployedContractData,
}: // refreshVariables,
// waitingResponse,
{
  deployedContractData: Contract<ContractName>;
  refreshVariables: number;
  waitingResponse: boolean;
}) => {
  const onChange = () => {
    console.log("onChange");
  };
  const isContractCheckedRead = (
    ((deployedContractData.abi || []) as Abi).filter(part => part.type === "function") as AbiFunction[]
  )
    .filter(fn => {
      const isQueryableWithParams =
        (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length > 0;
      return isQueryableWithParams;
    })
    .map(fn => {
      return {
        fn,
      };
    })
    .filter(part => part.fn.name === "isContractChecked");

  const functionsToDisplay = (deployedContractData.abi as Abi).filter(
    part => part.type === "function",
  ) as AbiFunction[];
  const functionApprove = functionsToDisplay.filter(part => part.name === "approve") as AbiFunction[];
  const functionChecker = functionsToDisplay.filter(part => part.name === "checkVerification") as AbiFunction[];

  return (
    <>
      <article className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-2 mt-8 space-y-1 py-4 w-min-272 max-w-xl w-full">
        <ReadOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          contractAddress={deployedContractData.address}
          abiFunction={isContractCheckedRead[0].fn}
          key={"isContractChecked"}
          // inheritedFrom={inheritedFrom}
        />

        <WriteOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          key={"approve"}
          abiFunction={functionApprove[0]}
          onChange={onChange}
          contractAddress={deployedContractData.address}
          // inheritedFrom={inheritedFrom}
        />

        <WriteOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          key={"checkVerification"}
          abiFunction={functionChecker[0]}
          onChange={onChange}
          contractAddress={deployedContractData.address}
          // inheritedFrom={inheritedFrom}
        />
      </article>
    </>
  );
};
