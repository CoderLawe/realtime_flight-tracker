import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import {
  ArrivalContext,
  ClickedContext,
  DepartureContext,
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
  const [departure, setDeparture] = useContext(DepartureContext);
  const [arrivalAirport, setArrivalAirport] = useContext(ArrivalContext);
  const [image, setImage] = useState("");
  const [estimated, setEstimated] = useState("");
  // const [searchResult, setSearchResult] = useContext(SearchContext);
  const [clicked, setClicked] = useContext(ClickedContext);
  const OPEN_SKY_API_BASE_URL = "https://opensky-network.org/api";

  const duration = 3600; // in seconds

  // Get the current time in Unix timestamp format
  const currentTime = Math.floor(Date.now() / 1000);

  // Specify a time range of 24 hours
  const timeRange = 24 * 60 * 60; // 24 hours in seconds
  console.log("flightData", flightData);
  useEffect(() => {
    const fetchFlightData = async () => {
      const departureResponse = await fetch(
        `${OPEN_SKY_API_BASE_URL}/flights/aircraft?icao24=${
          flightData[0]
        }&begin=${currentTime - timeRange}&end=${currentTime}`
      );
      const departureData = await departureResponse.json();
      const departure = departureData[0]?.estDepartureAirport || null;
      setDeparture(departure);

      const arrivalResponse = await fetch(
        `${OPEN_SKY_API_BASE_URL}/flights/aircraft?icao24=${
          flightData[0]
        }&begin=${currentTime - timeRange}&end=1679991765`
      );
      const arrivalData = await arrivalResponse.json();
      const arrival = arrivalData[1]?.estArrivalAirport || null;
      setArrivalAirport(arrival);
      const estimatedArrival = arrivalData[0]?.lastSeen || null;

      setEstimated(estimatedArrival);
      console.log("arrival info", arrivalData[1]);
      console.log("departure info", departure);
    };

    fetchFlightData();
  }, [flightData]);
  // useEffect(() => {
  //   setImage(url);
  // }, [url]);
  return (
    <div
      className={
        clicked &&
        "hidden lg:flex absolute bg-white top-[96px] left-[29px] z-40 h-[100px] "
      }
    >
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

            {arrivalAirport ? (
              <p className="text-[32px] text-black">{arrivalAirport}</p>
            ) : (
              <p className="text-[32px] text-black">Not available</p>
            )}
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
