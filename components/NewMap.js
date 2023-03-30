import { useState, useEffect, useContext } from "react";
import ReactMapGL, {
  FlyToInterpolator,
  Marker,
  Source,
  Layer,
} from "react-map-gl";
import axios from "axios";
import { IoMdAirplane } from "react-icons/io";
import { FlightContext, SelectedContext } from "./context/FlightContext";

const NewMap = () => {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });
  const [selectedFlight, setSelectedFlight] = useContext(SelectedContext);
  const [flightData, setFlightData] = useContext(FlightContext);
  const [flightTrack, setFlightTrack] = useState(null);

  console.log("longitude", { ...viewport });

  const [flights, setFlights] = useState([]);
  const [flightUrl, setFlightUrl] = useState("");

  // Flight trajectory line start

  const lineString = {
    type: "LineString",
    coordinates: flightTrack?.path?.map((point) => [point[2], point[1]]),
  };
  console.log(lineString.coordinates);

  const currentTime = Date.now() / 1000;
  const stringTime = parseInt(currentTime);

  async function getFlightTrackData(flightId) {
    const url = `https://opensky-network.org/api/tracks/all?icao24=${flightId}&time=${stringTime}`;
    const response = await fetch(url);
    return await response.json();
  }

  useEffect(() => {
    if (selectedFlight) {
      getFlightTrackData(selectedFlight[0]).then((data) =>
        setFlightTrack(data)
      );
      console.log("flightTrack", flightTrack);
    }
  }, [selectedFlight]);

  useEffect(() => {
    const fetchData = async () => {
      const longitude = viewport?.longitude;
      console.log("longitude", longitude);
      const latitude = viewport?.latitude;
      const radius = 500; // radius in nautical miles
      const url = `https://opensky-network.org/api/states/all?lamin=${
        latitude - radius / 60
      }&lomin=${longitude - radius / 60}&lamax=${
        latitude + radius / 60
      }&lomax=${longitude + radius / 60}&time=0`;

      setFlightUrl(url);
      try {
        const response = await fetch(url);
        const data = await response.json();

        setFlights(data.states);
        console.log("the flights", flights);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [viewport]);

  useEffect(() => {
    console.log("Flight URL", flightUrl);
  }, [flightUrl]);
  const handleFlyTo = ({ longitude, latitude }) => {
    setViewport({
      ...viewport,
      longitude,
      latitude,
      zoom: 10,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
      transitionDuration: "auto",
    });
  };

  const handleMove = (viewportNew) => {
    setViewport({
      longitude: viewportNew.longitude,
      latitude: viewportNew.latitude,
      zoom: 10,
    });
    console.log("New viewport");
  };

  useEffect(() => {
    console.log("viewport", viewport);
  }, [viewport]);

  return (
    <ReactMapGL
      // viewState={viewport}
      {...viewport}
      className="w-[100%] h-[100%] z-0 absolute "
      initialViewState={viewport}
      // onMove={handleMove}
      onMove={(evt) => {
        setViewport(evt.viewState);
        console.log("viewport", evt.viewState);
      }}
      mapStyle="mapbox://styles/coderlawe/cks0lilc80own17mv51dv90go"
      mapboxAccessToken="pk.eyJ1IjoiY29kZXJsYXdlIiwiYSI6ImNrcGZvbGE1ajBkd2QydnFvY2tndGs2cjYifQ.hx9O2OuDutDwo1AbZUREqg"
      width="100%"
      height="100%"
      interactiveZoom={true} // Enables zoom with scroll
      dragPan={true} // Enables panning
      // The spread operator gets everything to that point
    >
      {flights.map((flight) => (
        <div key={`flight-no${flight[0]}`} className="relative">
          <Marker longitude={flight[5]} latitude={flight[6]}>
            <IoMdAirplane
              onClick={() => {
                setFlightData(flight);
                setSelectedFlight(flight);
                console.log("flight data", flight[1]);
              }}
              style={{ rotate: `${flight[10]}deg` }}
              className={
                selectedFlight[0] === flight[0]
                  ? "text-blue-400 text-[32px] cursor-pointer"
                  : "text-yellow-400 text-[32px] cursor-pointer"
              }
            />
          </Marker>

          {/* New marker start */}

          {selectedFlight && (
            <Source
              type="geojson"
              data={{
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: lineString.coordinates,
                },
              }}
            >
              <Layer
                className="z-40"
                id="flightTrack"
                type="line"
                paint={{
                  "line-color": "#FFFF00",
                  "line-width": 2,
                }}
              />
            </Source>
          )}
        </div>
      ))}
    </ReactMapGL>
  );
};

export default NewMap;
