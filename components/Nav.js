import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import SearchIcon from "@mui/icons-material/Search";
import { useContext, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FlightsContext } from "./context/FlightContext";

const Nav = () => {
  const [flights, setFlights] = useContext(FlightsContext);
  const [searchData, setSearchData] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const flightSearch = (flightArray, search) => {
    // const data = flights?.filter((data) => data[1] === searchData);
    const data = flightArray.find((flight) => flight[1][0] === search);
    console.log("the search result is...", data);
    // setSearchData(data);

    console.log(searchData);
  };

  const makeSearch = () => {
    flightSearch(flights, searchData);
    console.log("callsign search succesful and found a match");
  };
  return (
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
  );
};

export default Nav;
