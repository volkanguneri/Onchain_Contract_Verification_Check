import React from "react";
import { Address as AddressType } from "viem";
import { Address } from "~~/components/scaffold-eth";

// Typage de l'événement
export type EventArgs = {
  address: AddressType;
  eventName: string;
  reason?: string;
};

export type EventType = {
  // Ensure this is exported
  event: "CheckRequestSent" | "CheckRequestFailed";
  args: EventArgs;
};

export type EventListProps = {
  eventList: EventType[]; // Use the exported type
};

export const EventList = ({ eventList }: EventListProps) => {
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
          {eventList.map(({ args }, i) => (
            <tr key={i}>
              <td className="py-3.5">{args.eventName}</td>
              <td className="py-3.5">
                <Address address={args.address} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// EventList Component
export const CustomEventList = ({ eventList }: EventListProps) => {
  return (
    <>
      {eventList.map((event: EventType, index: number) => (
        <li key={index}>
          {event.args.eventName === "CheckRequestSent" ? (
            <span>Check Request Sent: {event.args.address}</span>
          ) : event.args.eventName === "CheckRequestFailed" ? (
            <span style={{ color: "red" }}>Check Request Failed: {event.args.eventName}</span>
          ) : null}
        </li>
      ))}
    </>
  );
};

// {eventList.map(({ args }, i) => (
//   <tr key={i}>
//     <td className="py-3.5">{args.eventName}</td>
//     <td className="py-3.5">
//       <Address address={args.address} />
//     </td>
//   </tr>
// ))}
