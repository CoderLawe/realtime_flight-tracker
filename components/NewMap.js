import { useState, useEffect, useContext } from "react";
import ReactMapGL, {
  FlyToInterpolator,
  Marker,
  Source,
  Layer,
} from "react-map-gl";
import axios from "axios";
import { IoMdAirplane } from "react-icons/io";
import {
  AirportsContext,
  ClickedContext,
  FlightContext,
  SelectedContext,
} from "./context/FlightContext";
import { BsPinFill } from "react-icons/bs";

const NewMap = () => {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: -34.3239,
    longitude: 137.7587,
    zoom: 8,
  });
  const [selectedFlight, setSelectedFlight] = useContext(SelectedContext);
  const [flightData, setFlightData] = useContext(FlightContext);
  const [flightTrack, setFlightTrack] = useState(null);

  const [flights, setFlights] = useState([]);
  const [flightUrl, setFlightUrl] = useState("");

  const [airports, setAirports] = useContext(AirportsContext);
  const [mapMoving, setMapMoving] = useState(false);
  const [clicked, setClicked] = useContext(ClickedContext);
  // Airport data below

  function distanceBetween(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180; // deg2rad below
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;

    return R * 2 * Math.asin(Math.sqrt(a));
  }
  const fetchAirports = async () => {
    const response = await fetch("world_airports.json");
    const airports = await response.json();

    const filteredAirports = airports.filter(
      (airport) =>
        distanceBetween(
          airport.latitude,
          airport.longitude,
          viewport.latitude,
          viewport.longitude
        ) <= 500
    );

    setAirports(filteredAirports);
    console.log("The airports", airports);
  };

  // Fetch on initial load

  useEffect(() => {
    fetchAirports();
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
        fetchAirports();
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
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
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
                setClicked(true);
              }}
              style={{ rotate: `${flight[10]}deg` }}
              className={
                selectedFlight[0] === flight[0]
                  ? "text-red-600 text-[32px] cursor-pointer"
                  : "text-yellow-600 text-[32px] cursor-pointer"
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
                  "line-width": 3,
                }}
              />
            </Source>
          )}
        </div>
      ))}

      {airports.map((airport) => (
        <Marker
          key={airport.uid}
          longitude={airport?.longitude}
          latitude={airport?.latitude}
        >
          <div className="block group space-y-4 cursor-pointer">
            <p className="text-white bg-black/50 font-serif text-[12px] opacity-0 group-hover:opacity-100 px-2">
              {airport.name}
            </p>
            <BsPinFill className="text-red-400 text-[32px]" />
          </div>
        </Marker>
      ))}
    </ReactMapGL>
  );
};

export default NewMap;
