import React from "react";
import Bus from "../../assets/images/bus9.png";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Seat from "./Seat"

const Details = () => {
  return (
    <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[10ch]">
      <div className="w-full grid grid-cols-2 gap-16 items-center">
        <div className="col-span-1 space-y-8">
          <img
            src={Bus}
            alt="detail img"
            className="w-full aspect-[3/2] rounded-md object-contain"
          />

        </div>

        <div className="col-span-1 space-y-10">
        <div className="space-y-6">
            <Seat/>
          </div>
          <div className="flex">
            <Link to={"/bus/bus-details/checkout"} className="w-fit bg-violet-600 text-neutral-50 font-medium text-base px-6 py-2 rounded-md hover:bg-violet-700 ease-in-out duration-300">Processed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
