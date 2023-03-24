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
export const FlightProvider = ({ children }) => {
  const [flightData, setFlightData] = useState({ flight: 0 });
  const [url, setUrl] = useState();
  const [viewPortUpper, setViewPortUpper] = useState();
  const [viewPortLower, setViewPortLower] = useState();
  const [airframe, setAirframe] = useState("");
  const [arrivalData, setArrivalData] = useState("");
  const [selectedFlight, setSelectedFlight] = useState([]);
  const [flights, setFlights] = useState([]);
  return (
    <FlightContext.Provider value={[flightData, setFlightData]}>
      <ImageContext.Provider value={[url, setUrl]}>
        <UpperContext.Provider value={[viewPortUpper, setViewPortUpper]}>
          <LowerContext.Provider value={[viewPortLower, setViewPortLower]}>
            <AirFrameContext.Provider value={[airframe, setAirframe]}>
              <ArrivalContext.Provider value={[arrivalData, setArrivalData]}>
                <SelectedContext.Provider
                  value={[selectedFlight, setSelectedFlight]}
                >
                  <FlightsContext.Provider value={[flights, setFlights]}>
                    {children}
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
