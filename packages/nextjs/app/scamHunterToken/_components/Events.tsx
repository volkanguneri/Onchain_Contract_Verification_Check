import React from "react";
import { Address as AddressType } from "viem";
import { Address } from "~~/components/scaffold-eth";

export type Event = {
  address: AddressType;
  eventName: string;
};

export type EventsProps = {
  events: Event[];
};

export const Events = ({ events }: EventsProps) => {
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
          {events.map(({ address, eventName }, i) => (
            <tr key={i}>
              <td className="py-3.5">{eventName}</td>
              <td className="py-3.5">
                <Address address={address} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
