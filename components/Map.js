import React, { useContext, useEffect, useState } from "react";
import ReactMapGl, { Layer, Marker, Popup, Source } from "react-map-gl";
import getCenter from "geolib/es/getCenter";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoMdAirplane } from "react-icons/io";
import {
  ArrivalContext,
  FlightContext,
  SelectedContext,
} from "../components/context/FlightContext";
import axios from "axios";
// How to make a popup in react-map-gl that only opens when a specific marker is cliecked ?
function Map({ data, setViewport, viewport, flightTrack }) {
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

  const [selectedFlight, setSelectedFlight] = useContext(SelectedContext);
  const [selected, setSelected] = useState();
  const [toObject, setToObject] = useState({});
  const [flightData, setFlightData] = useContext(FlightContext);
  const [staged, setStaged] = useState({ flight: 0 });
  const [rotation, setRotation] = useState();
  console.log("rotation in deg", rotation?.toString());
  const [mapRef, setMapRef] = useState(null);
  // const [flightTrack, setFlightTrack] = useState(null);

  const [arrivalData, setArrivalData] = useContext(ArrivalContext);

  const handleViewportChange = (newViewport) => {
    // console.log("newViewport", newViewport);
    setViewport(newViewport);
  };
  const TRAJECTORY_URL = "https://opensky-network.org/api/tracks/all";

  const currentTime = Date.now() / 1000;
  const stringTime = parseInt(currentTime);

  // function getFlightTrackData(flightId) {
  //   const url = `https://opensky-network.org/api/tracks/all?icao24=${flightId}&time=${stringTime}`;
  //   return fetch(url).then((response) => response.json());
  // }
  // useEffect(() => {
  //   if (selectedFlight) {
  //     getFlightTrackData(selectedFlight[0]).then((data) =>
  //       setFlightTrack(data)
  //     );
  //     console.log("flightTrack", flightTrack);
  //   }
  // }, [selectedFlight]);

  const lineString = {
    type: "LineString",
    coordinates: flightTrack?.path?.map((point) => [point[2], point[1]]),
  };
  console.log("track map", lineString);
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
      className="w-[100%] h-[100%] z-0 absolute "
      ref={(ref) => setMapRef(ref && ref.getMap())}
      initialViewState={viewport}
      onViewportChange={() => handleViewportChange()}
      mapStyle="mapbox://styles/coderlawe/cks0lilc80own17mv51dv90go"
      mapboxAccessToken={process.env.MAPBOX_TOKEN}
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
                  latitude: selected[6],
                  longitude: selected[5],
                  zoom: 8,
                });
                setRotation(flight[10]);
              }}
              className={
                selectedFlight[0] === flight[0]
                  ? "text-blue-400 text-[32px] cursor-pointer"
                  : "text-yellow-400 text-[32px] cursor-pointer"
              }
            />
          </Marker>
        </div>
      ))}
      {/* <Layer
        className="z-40"
        id="flightTrack"
        type="line"
        paint={{
          "line-color": "#333333",
          "line-width": 10,
        }}
      /> */}
      {/* <Source type="geojson" data={geojson}>
        <Layer
          id="line"
          type="line"
          paint={{
            "line-color": "#FFFF00",
            "line-width": 2,
          }}
        />
      </Source> */}
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
