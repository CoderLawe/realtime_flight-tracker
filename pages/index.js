import Image from "next/image";
import Nav from "../components/Nav";
import Head from "next/head";
import FlightFeed from "../components/FlightFeed";
import Map from "../components/Map";
import InfoCard from "../components/InfoCard";
import { useContext, useEffect, useState } from "react";
import ReactMapGl, { Layer, Marker, Popup, Source } from "react-map-gl";
import { IoMdAirplane } from "react-icons/io";
import {
  FlightsContext,
  ImageContext,
  SelectedContext,
} from "../components/context/FlightContext";
import { FlyToInterpolator } from "react-map-gl";
import NewMap from "../components/NewMap";
import useSWR from "swr";
// import throttle from "lodash.throttle";

export default function Home({ airportData }) {
  // const [photos, setPhotos] = useState([]);
  const OPEN_SKY_API_BASE_URL = "https://opensky-network.org/api";

  const [selectedFlight, setSelectedFlight] = useContext(SelectedContext);
  const [flightTrack, setFlightTrack] = useState([]);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const [flights, setFlights] = useContext(FlightsContext);

  // const { data: flights } = useSWR(
  //   () => {
  //     const bbox = mapRef.current?.getMap().getBounds().toArray().toString();
  //     if (bbox) {
  //       return [
  //         `https://opensky-network.org/api/states/all?lamin=${bbox[0]}&lomin=${bbox[1]}&lamax=${bbox[2]}&lomax=${bbox[3]}&time=${startTime}&?`,
  //         startTime,
  //       ];
  //     }
  //   },
  //   fetcher,
  //   {
  //     refreshInterval: 5000,
  //   }
  // );

  // useEffect(() => {
  //   const getFlights = async () => {
  //     const bounds = viewport?.getBounds();
  //     const bbox = bounds.toArray().flat().join(",");
  //     const url = `https://opensky-network.org/api/states/all?bbox=${bbox}&time=0`;
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     setFlights(data.states);
  //     console.log("url", flights);
  //   };
  //   getFlights();
  // }, [viewport]);

  const handleFlyTo = (latitude, longitude) => {
    setViewport({
      ...viewport,
      latitude,
      longitude,
      zoom: 10,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const [url, setUrl] = useContext(ImageContext);

  const search = "Cessna 172";

  useEffect(() => {
    const fetchFlightTrack = async () => {
      if (selectedFlight) {
        const response = await fetch(
          `${OPEN_SKY_API_BASE_URL}/tracks/all?icao24=${selectedFlight[0]}&begin=1631606400&end=1631692800`
        );
        const data = await response.json();
        setFlightTrack(data);
      } else {
        setFlightTrack([]);
      }
    };
    fetchFlightTrack();
    console.log("track", flightTrack);
  }, [selectedFlight]);

  // useEffect(() => {
  //   console.log("viewport", viewport);
  // }, [viewport]);

  // useEffect(() => {
  //   const updateFlights = async () => {
  //     const { latitude, longitude, zoom } = viewport;
  //     const width = window.innerWidth;
  //     const height = window.innerHeight;
  //     const range = 360 / Math.pow(2, zoom);
  //     const neLat = latitude + (height / 2) * range;
  //     const neLon = longitude + (width / 2) * range;
  //     const swLat = latitude - (height / 2) * range;
  //     const swLon = longitude - (width / 2) * range;
  //     const url = `https://opensky-network.org/api/states/all?lamin=${swLat}&lomin=${swLon}&lamax=${neLat}&lomax=${neLon}`;
  //     // make API request with updated coordinates
  //   };

  //   updateFlights();
  // }, [viewport]);

  // const handleViewportChange = (viewport) => {
  //   setViewport(viewport);
  // };

  // useEffect(() => {
  //   const fetchFlights = async () => {
  //     const { latitude, longitude, width, height } = viewport;

  //     const numericWidth = parseInt(width);
  //     const numericHeight = parseInt(height);

  //     const lamax = latitude + numericHeight / 2;
  //     const lomin = longitude - numericWidth / 2;
  //     const lomax = longitude + numericWidth / 2;
  //     const lamin = latitude - numericHeight / 2;
  //     const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}&max=2`;

  //     // console.log(longitude);
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     setFlights(data.states);
  //   };

  //   fetchFlights();
  // }, [viewport, selectedFlight]);

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${search}&per_page=1`,
        {
          headers: {
            Authorization: process.env.PEXELS_KEY,
          },
        }
      );

      const { photos } = await response.json();
      const { src } = photos[0];

      setUrl(src.original);
    };

    fetchImage();
  }, [search, url]);

  // let dataType = typeof(data);
  // console.log("openSkyData", openSkyData);
  // Write a number counter in javascript?
  return (
    <div className="">
      <Head>
        <title>Flight Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body className="h-full">
        {/* HEader */}
        <div className="">
          <Nav />
        </div>
        <section className="h-[100%] w-[100%] absolute -mt-[55px]">
          {/* <Map
            viewport={viewport}
            setViewport={setViewport}
            data={flights}
            flightTrack={flightTrack}
            // airports={airportData}
            handleFlyTo={handleFlyTo}
          /> */}

          <NewMap />

          <InfoCard />
        </section>
        {/* <FlightFeed data={openSkyData} /> */}
      </body>
    </div>
  );
}

// export async function getServerSideProps() {
//   const fetchFlights = async () => {
//     const { latitude, longitude, width, height } = viewport;

//     const numericWidth = parseInt(width);
//     const numericHeight = parseInt(height);

//     const lamax = latitude + numericHeight / 2;
//     const lomin = longitude - numericWidth / 2;
//     const lomax = longitude + numericWidth / 2;
//     const lamin = latitude - numericHeight / 2;
//     const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}&max=2`;

//     // console.log(longitude);
//     const response = await fetch(url);
//     const openSkyData = await response.json();
//   };

//   fetchFlights();
//   return { props: { openSkyData } };
// }

// export async function getServerSideProps({ context }) {
//   const openSkyData = await fetch(
//     `https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.522`
//   ).then((res) => res.json());
//   // console.log(data)
//   return {
//     props: {
//       openSkyData,
//     },
//   };
// }
