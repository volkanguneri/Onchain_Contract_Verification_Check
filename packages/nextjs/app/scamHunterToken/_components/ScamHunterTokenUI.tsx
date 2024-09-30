"use client";

import { useEffect, useState } from "react";
import { Datas } from "./Datas";
import { Events } from "./EventList";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { ContractName } from "~~/utils/scaffold-eth/contract";

export const ScamHunterTokenUI = ({}) => {
  const contractName = "ScamHunterToken";

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    contractName as ContractName,
  );
  const { targetNetwork } = useTargetNetwork();
  const networkColor = useNetworkColor();

  // State variables
  const [refreshVariables, setRefreshVariables] = useState(0);
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [eventLogs, setEventLogs] = useState<any[]>([]);

  // // Handling logs from events (real-time)
  const onLogs = (logs: any) => {
    console.log(logs);
    //   console.log("onLogs TRIGGERED")
    setWaitingResponse(false);
    setRefreshVariables(refreshVariables + 1);

    //   setEventLogs(prevLogs => {
    //     const newLogs = [...prevLogs, ...logs]; // Append new logs
    //     console.log("🚀 onLogs TRIGGEREDAND EXECUTED")
    //     setEventLogs(newLogs);
    //   });
  };

  // Listen to real-time events
  useScaffoldWatchContractEvent({ contractName, eventName: "CheckRequestSent", onLogs });

  // Fetch event history (on page load)
  const { data: eventHistory } = useScaffoldEventHistory({
    contractName,
    eventName: "CheckRequestSent",
    fromBlock: 0n,
    watch: true,
    enabled: !!deployedContractData,
  });

  // Load only the last 10 events when the page loads
  useEffect(() => {
    if (eventHistory) {
      const latestEvents = eventHistory.slice(0, 12); // Get the last 12 events
      setEventLogs(latestEvents);
    }
  }, [eventHistory]);

  // Loading state
  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // No contract found state
  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </p>
    );
  }

  return (
    <>
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

      <div className="lg:grid lg:grid-cols-8">
        {/* Functions */}
        <div className="lg:col-start-2 lg:col-span-4 flex items-center justify-end">
          <Datas
            deployedContractData={deployedContractData}
            refreshVariables={refreshVariables}
            waitingResponse={waitingResponse}
          />
        </div>

        {/* Events */}
        <div className="lg:col-start-6 lg:col-span-4 flex items-start justify-start">
          <ul>
            <Events eventList={eventLogs} />
          </ul>
        </div>
      </div>
    </>
  );
};
