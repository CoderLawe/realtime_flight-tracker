const FlightFeed = ({ data }) => {
  console.log("data", data);
  return (
    <div>
      {data?.states.map((flight) => (
        <>
          <p className="text-white">
            Location - {flight[2]} Coords = {flight[5]}, {flight[6]}, speed,{" "}
            {flight[9]}
          </p>
        </>
      ))}
    </div>
  );
};

export default FlightFeed;
