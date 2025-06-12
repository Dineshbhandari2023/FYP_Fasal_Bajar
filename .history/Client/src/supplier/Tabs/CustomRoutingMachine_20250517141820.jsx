import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine";

// This component handles the routing functionality
export default function CustomRoutingMachine({
  waypoints,
  color = "blue",
  weight = 4,
  opacity = 0.6,
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !waypoints || waypoints.length < 2) return;

    // Create a routing control instance
    const routingControl = L.Routing.control({
      waypoints: waypoints.map((point) => L.latLng(point[0], point[1])),
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      lineOptions: {
        styles: [
          { color, opacity, weight },
          { color: "white", opacity: 0.5, weight: weight / 2 },
        ],
      },
      createMarker: () => null, // Don't create markers, we'll use our own
      // Hide the UI elements
      collapsible: true,
      collapsed: true,
      containerClassName: "display-none",
      // Add a custom formatter that returns empty strings for all instructions
      formatter: new L.Routing.Formatter({
        getIconHTML: () => "",
        formatInstruction: () => "",
      }),
    });

    // Add the control to the map
    routingControl.addTo(map);

    // Clean up function
    return () => {
      // Safely remove the routing control
      try {
        if (routingControl && map) {
          // First check if the control has routes with layers
          if (routingControl._router && routingControl._router._routes) {
            // Clear routes manually before removing control
            routingControl._router._routes = [];
          }

          // Check if the control has a _plan with a _line
          if (routingControl._plan && routingControl._plan._line) {
            // Set _line to null to prevent removeLayer call
            routingControl._plan._line = null;
          }

          // Now remove the control
          map.removeControl(routingControl);
        }
      } catch (error) {
        console.error("Error cleaning up routing control:", error);
      }
    };
  }, [map, waypoints, color, weight, opacity]);

  return null;
}
