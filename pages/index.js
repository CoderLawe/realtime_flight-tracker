import Image from "next/image";
import Nav from "../components/Nav";
import Head from "next/head";
import FlightFeed from "../components/FlightFeed";
import Map from "../components/Map";
import InfoCard from "../components/InfoCard";
import { useContext, useEffect, useState } from "react";
import {
  FlightsContext,
  ImageContext,
  SelectedContext,
} from "../components/context/FlightContext";
export default function Home({ data, openSkyData }) {
  // const [photos, setPhotos] = useState([]);
  const OPEN_SKY_API_BASE_URL = "https://opensky-network.org/api";

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const [flights, setFlights] = useContext(FlightsContext);
  const [selectedFlight, setSelectedFlight] = useContext(SelectedContext);
  const [flightTrack, setFlightTrack] = useState([]);

  const handleViewportChanged = (viewport) => {
    setBounds(viewport);
    getFlightData(viewport).then((data) => setFlightData(data));
  };

  const [url, setUrl] = useContext(ImageContext);

  const search = "777 300ER";

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

  useEffect(() => {
    const fetchFlights = async () => {
      const { latitude, longitude, width, height } = viewport;

      const numericWidth = parseInt(width);
      const numericHeight = parseInt(height);

      const lamax = latitude + numericHeight / 2;
      const lomin = longitude - numericWidth / 2;
      const lomax = longitude + numericWidth / 2;
      const lamin = latitude - numericHeight / 2;
      const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}&max=2`;

      // console.log(longitude);
      const response = await fetch(url);
      const data = await response.json();
      setFlights(data.states);
    };

    fetchFlights();
  }, [viewport]);

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${search}&per_page=1`,
        {
          headers: {
            Authorization:
              "uhGeXWCiM8eb8t427VbLOomzfey1UeN6aGrm1FnNymsqQ8qeGiAFHcJe",
          },
        }
      );

      const { photos } = await response.json();
      const { src } = photos[0];

      setUrl(src.original);
    };

    fetchImage();
    console.log("search", url);
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
          <Map
            viewport={viewport}
            setViewport={setViewport}
            data={flights}
            flightTrack={flightTrack}
          />

          <InfoCard />
        </section>
        {/* <FlightFeed data={openSkyData} /> */}
      </body>
    </div>
  );
}

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
