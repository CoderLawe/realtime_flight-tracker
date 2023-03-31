import { useEffect, useState } from "react";
import axios from "axios";

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(
        " https://opensky-network.org/api/states/all?lamin=-4.106512082561727&lomin=20.754715609603956&lamax=12.560154584104941&lomax=37.42138227627063&time=0"
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // render the data
}
