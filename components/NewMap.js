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

  const [flights, setFlights] = useState([]);
  const [flightUrl, setFlightUrl] = useState("");

  const [airports, setAirports] = useState([]);
  const [mapMoving, setMapMoving] = useState(false);

  // Airport data below

  useEffect(() => {
    fetch("csvjson.json").then((response) =>
      response
        .json()
        .then((data) => setAirports(data))
        .catch((err) =>
          console.log(
            "Fetching the airports failed with the following error",
            err
          )
        )
    );

    console.log("airports,", airports);
  }, []);

  // Flight trajectory line start

  const lineString = {
    type: "LineString",
    coordinates: flightTrack?.path?.map((point) => [point[2], point[1]]),
  };

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
    }
  }, [selectedFlight]);

  // Getting flight data array

  const fetchData = async () => {
    const longitude = viewport?.longitude;
    console.log("longitude", longitude);
    const latitude = viewport?.latitude;
    const radius = 500; // radius in nautical miles
    const url = `https://opensky-network.org/api/states/all?lamin=${
      latitude - radius / 60
    }&lomin=${longitude - radius / 60}&lamax=${latitude + radius / 60}&lomax=${
      longitude + radius / 60
    }&time=0`;

    setFlightUrl(url);
    try {
      const response = await fetch(url);
      const data = await response.json();

      setFlights(data.states);
      console.log(
        "Fetch function ran succesfully for coords",
        longitude,
        latitude,
        "and fetch url",
        url
      );
    } catch (error) {
      console.error("error", error.message);
    }
  };

  useEffect(() => {
    if (!mapMoving) {
      const delayDebounceFn = setTimeout(() => {
        fetchData();
      }, 5000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [mapMoving]);

  useEffect(() => {
    console.log("map is moving", mapMoving);
  }, [mapMoving]);

  // const handleViewportChange = (evt) => {
  //   setViewport(evt.viewState);
  //   setMapMoving(true);
  // };

  // useEffect(() => {
  //   console.log("Flight URL", flightUrl);
  // }, [flightUrl]);
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

  return (
    <ReactMapGL
      // viewState={viewport}
      {...viewport}
      className="w-[100%] h-[100%] z-0 absolute "
      initialViewState={viewport}
      // onMove={handleMove}
      onMove={(evt) => {
        setViewport(evt.viewState);
        setMapMoving(true);
        setTimeout(() => {
          setMapMoving(false);
        }, 5000);

        // console.log("viewport", evt.viewState);
      }}
      mapStyle="mapbox://styles/coderlawe/clfwfy5mo001j01ogk2i5q5if"
      mapboxAccessToken={process.env.MAPBOX_TOKEN}
      width="100%"
      height="100%"
      interactiveZoom={true} // Enables zoom with scroll
      dragPan={true} // Enables panning
      // The spread operator gets everything to that point
    >
      {flights?.map((flight) => (
        <div key={`flight-no${flight[0]}`} className="relative">
          <Marker longitude={flight[5]} latitude={flight[6]}>
            <IoMdAirplane
              onClick={() => {
                setFlightData(flight);
                setSelectedFlight(flight);
              }}
              style={{ rotate: `${flight[10]}deg` }}
              className={
                selectedFlight[0] === flight[0]
                  ? "text-blue-500 text-[32px] cursor-pointer"
                  : "text-yellow-500 text-[32px] cursor-pointer"
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
