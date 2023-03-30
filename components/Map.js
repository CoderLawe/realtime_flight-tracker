import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMapGl, { Layer, Marker, Popup, Source } from "react-map-gl";
import getCenter from "geolib/es/getCenter";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoMdAirplane } from "react-icons/io";
import {
  ArrivalContext,
  FlightContext,
  SelectedContext,
} from "../components/context/FlightContext";
// How to make a popup in react-map-gl that only opens when a specific marker is cliecked ?
function Map({ data, airports }) {
  //   const coordinates = { longitude: 8.9867, latitude: 46.3347 };
  //   const coordinates = data?.states.map((res) => ({
  //     longitude: res[5],
  //     latitude: res[6],
  //   }));
  //   const center = getCenter(coordinates);

  //   const [popupOpen, setPopupOpen] = useState(false);
  //   const [viewPort, setViewPort] = useState({
  //     width: "100%",
  //     height: "100%",
  //     longitude: center.longitude,
  //     latitude: center.latitude,
  //     zoom: 10,
  //   });
  const [flights, setFlights] = useState([]);
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });
  const [loading, setLoading] = useState(true);

  const [selectedFlight, setSelectedFlight] = useContext(SelectedContext);
  const [selected, setSelected] = useState();
  const [toObject, setToObject] = useState({});
  const [flightData, setFlightData] = useContext(FlightContext);
  const [staged, setStaged] = useState({ flight: 0 });
  const [rotation, setRotation] = useState();
  console.log("rotation in deg", rotation?.toString());
  const [flightTrack, setFlightTrack] = useState(null);
  const mapRef = useRef();

  const [arrivalData, setArrivalData] = useContext(ArrivalContext);

  const onViewportChange = useCallback((newViewport) => {
    setViewport(newViewport.viewport);
    const bbox = newViewport.viewport.getBounds().toArray().toString();
    const url = `https://opensky-network.org/api/states/all?bbox=${bbox}&time=0`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => setFlights(data.states));
  }, []);

  const TRAJECTORY_URL = "https://opensky-network.org/api/tracks/all";

  const currentTime = Date.now() / 1000;
  const stringTime = parseInt(currentTime);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const bbox = viewport.getBounds().toArray().toString();
        const url = `https://opensky-network.org/api/states/all?bbox=${bbox}&time=0`;
        const response = await fetch(url);
        const data = await response.json();
        setFlights(data.states);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFlights();
  }, [viewport]);

  function getFlightTrackData(flightId) {
    const url = `https://opensky-network.org/api/tracks/all?icao24=${flightId}&time=${stringTime}`;
    return fetch(url).then((response) => response.json());
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
    const fetchFlights = async () => {
      try {
        const bbox = mapRef.current.getMap().getBounds().toArray().toString();
        const flights = await list(bbox);
        setFlights(flights);
        setLoading(false);
        console.log("flights", flights);
        console.log("loading", loading);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFlights();
  }, []);
  // const lineString = {
  //   type: "LineString",
  //   coordinates: flightTrack?.path?.map((point) => [point[2], point[1]]),
  // };
  console.log("track map", lineString.coordinates);
  useEffect(() => {
    if (selectedFlight) {
      setArrivalData(selectedFlight[0]);
    }

    // console.log("arrivalData", arrivalData);
  }, [selectedFlight]);

  console.log("selected", selectedFlight);
  useEffect(() => {
    setRotation();
  }, []);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const initialViewport = {
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         zoom: 8,
  //       };
  //       setViewport(initialViewport);
  //       console.log("viewport current", initialViewport);
  //     },
  //     (error) => console.log(error),
  //     { enableHighAccuracy: true, timeout: 5000 }
  //   );
  // }, []);

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [118.8002, 36.9736],
            [-122.41669, 37.7853],
            [-122.41688, 37.7849],
            [-122.41696, 37.7847],
            [-122.41699, 37.7846],
            [-122.41707, 37.7844],
          ],
        },
      },
    ],
  };

  useEffect(() => {
    // const changeViewport = (long, lat) => {
    //   if(selected){
    //     setViewport()
    //   }
    // }
    console.log("viewport", viewport);
  }, [viewport]);

  return (
    <ReactMapGl
      // viewState={viewport}
      {...viewport}
      className="w-[100%] h-[100%] z-0 absolute "
      initialViewState={viewport}
      onMove={onViewportChange}
      // onMove={(evt) => setViewport(evt.viewport)}
      mapStyle="mapbox://styles/coderlawe/cks0lilc80own17mv51dv90go"
      mapboxAccessToken="pk.eyJ1IjoiY29kZXJsYXdlIiwiYSI6ImNrcGZvbGE1ajBkd2QydnFvY2tndGs2cjYifQ.hx9O2OuDutDwo1AbZUREqg"
      width="100%"
      height="100%"
      interactiveZoom={true} // Enables zoom with scroll
      dragPan={true} // Enables panning
      // The spread operator gets everything to that point
    >
      {data.map((flight) => (
        <div key={`flight-no${flight[0]}`} className="relative">
          <Marker longitude={flight[5]} latitude={flight[6]}>
            <IoMdAirplane
              style={{ rotate: `${flight[10]}deg` }}
              onClick={() => {
                setFlightData(flight);
                setSelectedFlight(flight);
                setViewport({
                  width: "100vw",
                  height: "100vh",
                  latitude: selected[6] ? selected[6] : null,
                  longitude: selected[5],
                  zoom: 8,
                });
                setRotation(flight[10]);
                handleFlyTo(flight[6], flight[5]);
              }}
              className={
                selectedFlight[0] === flight[0]
                  ? "text-blue-400 text-[32px] cursor-pointer"
                  : "text-yellow-400 text-[32px] cursor-pointer"
              }
            />
          </Marker>

          {/* New marker start */}
        </div>
      ))}

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
    </ReactMapGl>
  );
}

export default Map;
