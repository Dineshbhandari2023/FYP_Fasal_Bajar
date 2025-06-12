import { useEffect, useState } from "react";
import { Polyline } from "react-leaflet";

// You'll need to sign up for a free API key at https://account.mapbox.com/auth/signup/
const MAPBOX_ACCESS_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN"; // Replace with your token

const MapboxDirectionsLayer = ({
  waypoints,
  color = "blue",
  weight = 4,
  opacity = 0.6,
}) => {
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only proceed if we have at least 2 waypoints
    if (!waypoints || waypoints.length < 2) {
      setRouteGeometry(null);
      return;
    }

    const fetchRoute = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Format waypoints for the Mapbox API (longitude comes first)
        const coordinates = waypoints
          .map((point) => `${point[1]},${point[0]}`)
          .join(";");

        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching route: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          // Convert from [lng, lat] to [lat, lng] for Leaflet
          const coordinates = data.routes[0].geometry.coordinates.map(
            (coord) => [coord[1], coord[0]]
          );
          setRouteGeometry(coordinates);
        } else {
          setError("No route found");
        }
      } catch (err) {
        console.error("Error fetching route:", err);
        setError(err.message);
        // Fall back to a straight line if the API fails
        setRouteGeometry(waypoints);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoute();
  }, [waypoints]);

  if (isLoading) {
    // You could render a loading indicator here
    return null;
  }

  if (error) {
    console.warn("Routing error:", error);
    // Fall back to a straight line if there's an error
    return (
      <Polyline
        positions={waypoints}
        pathOptions={{
          color,
          weight,
          opacity,
          dashArray: "5, 5", // Use a dashed line to indicate it's a fallback
        }}
      />
    );
  }

  if (!routeGeometry) return null;

  return (
    <Polyline
      positions={routeGeometry}
      pathOptions={{
        color,
        weight,
        opacity,
      }}
    />
  );
};

export default MapboxDirectionsLayer;
