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
  console.log("🚀 ScamHunterTokenUI started");

  const contractName = "ScamHunterToken";

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    contractName as ContractName,
  );
  const { targetNetwork } = useTargetNetwork();
  const networkColor = useNetworkColor();

  // State variables
  const [eventLogs, setEventLogs] = useState<any[]>([]);

  // Fetch event history (on page load)
  const {
    data: eventHistory,
    isLoading: eventLoading,
    error: error,
  } = useScaffoldEventHistory({
    contractName,
    eventName: "CheckRequestSent",
    fromBlock: 0n,
    watch: true,
  });

  useEffect(() => {
    console.log("🚀 ~ ScamHunterTokenUI ~ error:", error);
    console.log("🚀 ~ useEffect ~ eventLoadingSOLO:", eventLoading);
  }, [error, eventLoading]);

  // Handling logs from events (real-time)
  const onLogs = (logs: any) => {
    console.log("🚀 ~ ONLOGS TRIGGERED");
    console.log("🚀 ~ onLogs ~ logs:", logs);
    // setEventLogs(logs);
    if (!eventLoading && Boolean(eventHistory?.length) && (eventHistory?.length as number) > eventLogs.length) {
      console.log("🚀 ~ useEffect ~ eventHistory DEDANS:", eventHistory);

      // Ensure eventHistory is an array or fallback to []
      setEventLogs([...(eventHistory || [])].slice(0, 12));
    }
  };

  // Listen to real-time events
  useScaffoldWatchContractEvent({ contractName, eventName: "CheckRequestSent", onLogs });

  useEffect(() => {
    // console.log("🚀 ~ useEffect ~ eventLoading:", eventLoading)
    // console.log("🚀 ~ useEffect ~ eventHistory:", eventHistory)
    // console.log("🚀 ~ useEffect ~ eventLogs:", eventLogs)
    console.log("🚀 ~ useEffect ~ eventHistory DEHORS:", eventHistory);
    if (!eventLoading && Boolean(eventHistory?.length) && (eventHistory?.length as number) > eventLogs.length) {
      console.log("🚀 ~ useEffect ~ eventHistory DEDANS:", eventHistory);

      // Ensure eventHistory is an array or fallback to []
      setEventLogs([...(eventHistory || [])].slice(0, 12));
    }
  }, [eventHistory, eventLoading, eventLogs.length]);

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

  console.log("Scam...UI EXECUTED");

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
          <Datas deployedContractData={deployedContractData} />
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
