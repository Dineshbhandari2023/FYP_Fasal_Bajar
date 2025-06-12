import { Polyline } from "react-leaflet";

const SimpleRouteLayer = ({
  waypoints,
  color = "blue",
  weight = 4,
  opacity = 0.6,
}) => {
  // Filter out any invalid waypoints
  const validWaypoints = waypoints.filter(
    (point) => Array.isArray(point) && point.length === 2
  );

  // Only render if we have at least 2 valid waypoints
  if (validWaypoints.length < 2) return null;

  return (
    <Polyline
      positions={validWaypoints}
      pathOptions={{
        color,
        weight,
        opacity,
      }}
    />
  );
};

export default SimpleRouteLayer;
