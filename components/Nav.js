import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { IoMdAirplane } from "react-icons/io";
import {
  ArrivalContext,
  DepartureContext,
  FlightContext,
  FlightsContext,
  SearchContext,
  SelectedContext,
} from "./context/FlightContext";

const Nav = ({ search }) => {
  const [flights, setFlights] = useContext(FlightsContext);
  const [searchData, setSearchData] = useState("");
  const [searchResult, setSearchResult] = useContext(SearchContext);
  const [selectedFlight, setSelectedFlight] = useContext(SelectedContext);
  const [flightData, setFlightData] = useContext(FlightContext);

  const [arrivalData, setArrivalData] = useContext(ArrivalContext);
  const [departure, setDeparture] = useContext(DepartureContext);
  const makeSearch = () => {
    const filteredFlights = flights.filter((flight) =>
      flight[1].toLowerCase().includes(searchData.toLowerCase())
    );
    setSearchResult(filteredFlights);
    setSelectedFlight(searchResult);
    setFlightData(searchResult);

    console.log("Search was succesful. The  FLIGHT results were", flightData);
  };

  return (
    <div>
      {/* Large screen navbar */}
      <div className="hidden h-[52px]  max-w-8xl bg-black lg:flex items-center  px-[20px] py-[6px] mx-[30px] relative z-30">
        <p className="text-gray-200 text-[32px]">
          November<span className="text-yellow-300">Romeo</span>
        </p>

        <div className="flex items-center space-x-12 ml-[40px]">
          <p className="text-[14px] text-gray-400">Apps</p>
          <p className="text-[14px] text-gray-400">Add coverage</p>
          <p className="text-[14px] text-gray-400">Data/History</p>
          <p className="text-[14px] text-gray-400">Subscription Plans</p>
          <p className="text-[14px] text-gray-400">Login</p>
        </div>

        <div className="flex  px-5  space-x-3 items-center ml-[40px] border border-gray-400 rounded-[8px]">
          <div className="">
            <input
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              className="py-2 rounded-[8px] bg-transparent focus:outline-none text-gray-200"
              type="text"
              placeholder="Enter a Flight number/callsign here"
            />
          </div>

          <AiOutlineSearch
            onClick={makeSearch}
            className="text-[20px] text-gray-200"
          />
        </div>
      </div>

      {/* Small screen navbar */}
      <div className="block absolute bottom-0 z-[30]">
        <div className="flex justify-between items-center w-screen lg:hidden bg-gray-900/60 h-[50px] px-5 py-7  ">
          {/* Left side */}
          <div>
            <p className="text-[40px] text-yellow-500">
              N<span className="text-gray-100">R</span>
            </p>
          </div>

          {/* Right side */}

          <div>
            {/* <AiOutlineMenu className="text-gray-100 text-[40px]" /> */}
            <Image src={search} height={250} width={300} />
          </div>
        </div>
        <div
          className={
            selectedFlight === []
              ? "hidden"
              : "h-[100px] bg-gray-300 w-full flex lg:hidden  justify-between p-[10px]"
          }
        >
          {selectedFlight && (
            <p className="text-gray-900 text-[24px]">{departure}</p>
          )}

          <IoMdAirplane className="text-yellow-500 rotate-[90deg] text-[40px] bg-white rounded-full " />
          <p className="text-gray-900 text-[24px]">Arrival</p>
        </div>
      </div>
      {/* Bottom half */}
    </div>
  );
};

export default Nav;
