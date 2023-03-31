import { createContext, useState } from "react";

export const FlightContext = createContext();
export const ImageContext = createContext();
export const UpperContext = createContext();
export const LowerContext = createContext();
export const AirFrameContext = createContext();
export const ArrivalContext = createContext();
export const DepartureContext = createContext();
export const SelectedContext = createContext();
export const FlightsContext = createContext();
export const SearchContext = createContext();
export const FetchContext = createContext();
export const FlightUrlContext = createContext();
export const ViewportContext = createContext();

export const FlightProvider = ({ children }) => {
  const [flightData, setFlightData] = useState({ flight: 0 });
  const [url, setUrl] = useState();
  const [viewPortUpper, setViewPortUpper] = useState();
  const [viewPortLower, setViewPortLower] = useState();
  const [airframe, setAirframe] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [selectedFlight, setSelectedFlight] = useState([]);
  const [flights, setFlights] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [flightUrl, setFlightUrl] = useState("");
  const [departure, setDeparture] = useState("");

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  // const fetchData = async () => {
  //   const longitude = viewport?.longitude;
  //   console.log("longitude", longitude);
  //   const latitude = viewport?.latitude;
  //   const radius = 500; // radius in nautical miles
  //   const url = `https://opensky-network.org/api/states/all?lamin=${
  //     latitude - radius / 60
  //   }&lomin=${longitude - radius / 60}&lamax=${latitude + radius / 60}&lomax=${
  //     longitude + radius / 60
  //   }&time=0`;

  //   setFlightUrl(url);
  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();

  //     setFlights(data.states);
  //     console.log("the flights", flights);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <FlightContext.Provider value={[flightData, setFlightData]}>
      <ImageContext.Provider value={[url, setUrl]}>
        <UpperContext.Provider value={[viewPortUpper, setViewPortUpper]}>
          <LowerContext.Provider value={[viewPortLower, setViewPortLower]}>
            <AirFrameContext.Provider value={[airframe, setAirframe]}>
              <ArrivalContext.Provider
                value={[arrivalAirport, setArrivalAirport]}
              >
                <SelectedContext.Provider
                  value={[selectedFlight, setSelectedFlight]}
                >
                  <FlightsContext.Provider value={[flights, setFlights]}>
                    <SearchContext.Provider
                      value={[searchResult, setSearchResult]}
                    >
                      <FlightUrlContext.Provider
                        value={[flightUrl, setFlightUrl]}
                      >
                        <ViewportContext.Provider
                          value={[viewport, setViewport]}
                        >
                          <DepartureContext.Provider
                            value={[departure, setDeparture]}
                          >
                            {children}
                          </DepartureContext.Provider>
                        </ViewportContext.Provider>
                      </FlightUrlContext.Provider>
                    </SearchContext.Provider>
                  </FlightsContext.Provider>
                </SelectedContext.Provider>
              </ArrivalContext.Provider>
            </AirFrameContext.Provider>
          </LowerContext.Provider>
        </UpperContext.Provider>
      </ImageContext.Provider>
    </FlightContext.Provider>
  );
};
