import React from "react";
import { Address as AddressType } from "viem";
import { Address } from "~~/components/scaffold-eth";

// Typage de l'événement
export type EventArgs = {
  contractAddress: AddressType;
};

export type EventType = {
  args: EventArgs;
  eventName: string;
};

// Typage des propriétés du composant
export type EventProps = {
  eventList: EventType[];
};

export const Events = ({ eventList }: EventProps) => {
  return (
    <div className="mx-10">
      <table className="mt-4 p-2 bg-base-100 table table-zebra shadow-lg w-full overflow-hidden">
        <thead className="text-accent text-lg">
          <tr>
            <th className="bg-primary text-lg">Event Name</th>
            <th className="bg-primary text-lg">Address</th>
          </tr>
        </thead>
        <tbody>
          {eventList.map(({ eventName, args }, i) => (
            <tr key={i}>
              <td className="py-3.5">{eventName}</td>
              <td className="py-3.5">
                <Address address={args.contractAddress} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
