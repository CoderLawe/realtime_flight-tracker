import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import {
  FlightContext,
  ImageContext,
  SearchContext,
  SelectedContext,
} from "./context/FlightContext";
import { BsAirplaneEngines } from "react-icons/bs";
import { SlSpeedometer } from "react-icons/sl";
import { WiBarometer } from "react-icons/wi";
import { BiStopwatch } from "react-icons/bi";
function InfoCard() {
  const [flightData, setFlightData] = useContext(FlightContext);
  const [selectedFlight, setSelectedFlight] = useContext(SelectedContext);
  const [url, setUrl] = useContext(ImageContext);
  const [departure, setDeparture] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [image, setImage] = useState("");
  const [estimated, setEstimated] = useState("");
  const [searchResult, setSearchResult] = useContext(SearchContext);
  const OPEN_SKY_API_BASE_URL = "https://opensky-network.org/api";

  const currentDateTime = new Date();
  const startTime = currentDateTime.toISOString().slice(0, -5);

  useEffect(() => {
    const fetchFlightData = async () => {
      const departureResponse = await fetch(
        `${OPEN_SKY_API_BASE_URL}/flights/aircraft?icao24=${flightData[0]}&begin=1${startTime}`
      );
      const departureData = await departureResponse.json();
      const departure = departureData[0]?.estDepartureAirport || null;
      setDeparture(departure);

      const arrivalResponse = await fetch(
        `${OPEN_SKY_API_BASE_URL}/flights/aircraft?icao24=${flightData[0]}&begin=${startTime}`
      );
      const arrivalData = await arrivalResponse.json();
      const arrival = arrivalData[0]?.estArrivalAirport || null;
      setArrivalAirport(arrival);
      const estimatedArrival = arrivalData[0]?.lastSeen || null;

      setEstimated(estimatedArrival);
      // console.log("arrival info", arrivalAirport);
      // console.log("departure info", departure);
    };

    fetchFlightData();
  }, [flightData]);
  // useEffect(() => {
  //   setImage(url);
  // }, [url]);
  return (
    <div className="hidden lg:flex absolute bg-white top-[96px] left-[29px] z-40 h-[100px] w-[500px] ">
      <div className="flex-col">
        <div className="flex justify-between bg-[#303030]">
          {/* Left side */}
          <p className="text-yellow-400 text-[24px]">Flight {flightData[1]}</p>

          {/* Right side */}

          {/* <AiCloseIcon */}
        </div>

        <div className="h-[250px] w-full ">
          <img src={url} className="h-[250px] w-full object-cover" />
        </div>

        <div className="bg-gray-200 w-full  block border-t border-black mt-[10px]">
          <div className="flex justify-between items-center py-[32px] px-[12px]">
            <p className="text-[32px] text-black">{departure && departure}</p>
            <BsAirplaneEngines className="text-yellow-500 text-[32px]" />

            <p className="text-[32px] text-black">
              {arrivalAirport && arrivalAirport}
            </p>
          </div>

          <div className="flex justify-center space-x-[20px] py-[12px]">
            <div className="flex space-x-2 items-center">
              <SlSpeedometer className="text-[32px] text-blue-900" />
              <p>Ground speed: {flightData[9]}</p>
            </div>

            <div className="flex space-x-2 items-center">
              <WiBarometer className="text-[50px] text-blue-900" />
              <p>Altitude: {flightData[7]} meters</p>
            </div>
          </div>

          <div className="mx-[12px]">
            <div className="flex space-x-2 items-center">
              <BiStopwatch className="text-[50px] text-blue-900" />
              <p>ETA: {estimated} </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
