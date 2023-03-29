import { useState, useEffect } from "react";
import ReactMapGL, { FlyToInterpolator, Marker } from "react-map-gl";
import axios from "axios";
import { IoMdAirplane } from "react-icons/io";

const NewMap = () => {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  console.log("longitude", { ...viewport });

  const [flights, setFlights] = useState([]);
  const [flightUrl, setFlightUrl] = useState("");

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
              style={{ rotate: `${flight[10]}deg` }}
              className="text-yellow-400 text-[32px] cursor-pointer"
            />
          </Marker>

          {/* New marker start */}
        </div>
      ))}
    </ReactMapGL>
  );
};

export default NewMap;
