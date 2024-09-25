"use client";

import { useState } from "react";
import { Datas } from "./Datas";
import { Events } from "./Events";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { ContractName } from "~~/utils/scaffold-eth/contract";

export const ScamHunterTokenUI = ({}) => {
  const contractName = "ScamHunterToken";

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    contractName as ContractName,
  );
  const { targetNetwork } = useTargetNetwork();
  const networkColor = useNetworkColor();

  //////////////////////////////////////////////////////////////////////////////
  const [refreshVariables, setRefreshVariables] = useState(0);
  const [waitingResponse, setWaitingResponse] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////
  const [eventLogs, setEventLogs] = useState<any[]>([]);

  const onLogs = (logs: any) => {
    setWaitingResponse(false);
    setRefreshVariables(refreshVariables + 1);
    setEventLogs(prevLogs => [...prevLogs, ...logs]);
  };

  useScaffoldWatchContractEvent({ contractName, eventName: "CheckRequestSent", onLogs });
  useScaffoldWatchContractEvent({ contractName, eventName: "CheckRequestFailed", onLogs });

  ///////////////////////////////////////////////////////////////////////////////////

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </p>
    );
  }

  return (
    <>
      {/* Functions */}
      <div className="lg:flex">
        <div className="w-full px-8 flex flex-grow items-center justify-center">
          <Datas
            deployedContractData={deployedContractData}
            refreshVariables={refreshVariables}
            waitingResponse={waitingResponse}
          />
        </div>

        {/* Events */}
        <div className="mx-auto flex flex-end">
          <ul>
            <Events events={eventLogs} />
          </ul>
        </div>
      </div>

      {/* Contract Information */}
      <div className="min-[900px]:fixed top-24 left-8 bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 space-y-1 py-4 max-w-xl mx-auto">
        <div className="flex">
          <div className="flex flex-col gap-1">
            <span className="font-bold">{contractName}</span>
            <Address address={deployedContractData.address} />
            <div className="flex gap-1 items-center">
              <span className="font-bold text-sm">Balance:</span>
              <Balance address={deployedContractData.address} className="px-0 h-1.5 min-h-[0.375rem]" />
            </div>
          </div>
        </div>
        {targetNetwork && (
          <p className="my-0 text-sm">
            <span className="font-bold">Network</span>:{" "}
            <span style={{ color: networkColor }}>{targetNetwork.name}</span>
          </p>
        )}
      </div>
    </>
  );
};
