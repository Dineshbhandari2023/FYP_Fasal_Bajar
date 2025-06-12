import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine";

// Custom wrapper for Leaflet Routing Machine
const CustomRoutingMachine = ({
  waypoints,
  color = "blue",
  weight = 4,
  opacity = 0.6,
}) => {
  const map = useMap();
  const routingControlRef = useRef(null);
  const isFirstRender = useRef(true);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Skip if no waypoints or not enough waypoints
    if (!waypoints || waypoints.length < 2) return;

    // Clean up function to safely remove routing control
    const cleanupRouting = () => {
      // Cancel any pending routing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      // Remove the routing control if it exists
      if (routingControlRef.current) {
        try {
          // First try to remove it using the map's removeControl method
          if (map && typeof map.removeControl === "function") {
            map.removeControl(routingControlRef.current);
          }
        } catch (error) {
          console.error("Error removing routing control:", error);
        }
        routingControlRef.current = null;
      }
    };

    // Clean up previous routing control
    cleanupRouting();

    // Create a new AbortController for this render
    abortControllerRef.current = new AbortController();

    // Create valid L.LatLng objects from waypoints
    const routeWaypoints = waypoints
      .map((point) => {
        if (Array.isArray(point) && point.length === 2) {
          return L.latLng(point[0], point[1]);
        } else if (
          point &&
          typeof point === "object" &&
          point.lat &&
          point.lng
        ) {
          return L.latLng(point.lat, point.lng);
        }
        return null;
      })
      .filter(Boolean);

    // Only proceed if we have valid waypoints
    if (routeWaypoints.length < 2) return;

    try {
      // Create a custom plan with no markers
      const plan = new L.Routing.Plan(routeWaypoints, {
        createMarker: () => null, // Don't create markers
        draggableWaypoints: false,
        addWaypoints: false,
      });

      // Create a custom router that can be aborted
      const router = new L.Routing.OSRMv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        timeout: 30000, // 30 seconds timeout
      });

      // Patch the router's _makeRequest method to use our AbortController
      const originalMakeRequest = router._makeRequest;
      router._makeRequest = function (url, callback) {
        if (abortControllerRef.current) {
          const signal = abortControllerRef.current.signal;
          const headers = new Headers();
          headers.append("Content-Type", "application/json");

          fetch(url, {
            method: "GET",
            headers,
            signal,
          })
            .then((response) => response.json())
            .then((data) => {
              if (!signal.aborted) {
                callback(null, data);
              }
            })
            .catch((error) => {
              if (!signal.aborted) {
                callback(error || new Error("Request failed"));
              }
            });
          return;
        }

        // Fall back to original method if no AbortController
        originalMakeRequest.call(this, url, callback);
      };

      // Create routing control with our custom plan and router
      routingControlRef.current = L.Routing.control({
        plan,
        router,
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: false,
        show: false,
        lineOptions: {
          styles: [
            { color, opacity, weight },
            { color: "white", opacity: 0.5, weight: weight / 2 },
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
        },
        // Hide the itinerary and waypoint panels
        collapsible: true,
        collapsed: true,
        // Completely hide the control container
        containerClassName: "display-none",
        // Disable all UI elements
        addWaypoints: false,
        draggableWaypoints: false,
        waypointMode: "connect",
        useZoomParameter: false,
        autoRoute: true,
        // Add a custom formatter that returns empty strings for all instructions
        formatter: new L.Routing.Formatter({
          getIconHTML: () => "",
          formatInstruction: () => "",
        }),
      });

      // Add custom error handling
      routingControlRef.current.on("routingerror", (e) => {
        console.warn("Routing error:", e.error);
        // Don't show error to user, just log it
      });

      // Add the control to the map
      routingControlRef.current.addTo(map);
    } catch (error) {
      console.error("Error creating routing control:", error);
    }

    // Clean up when component unmounts or dependencies change
    return cleanupRouting;
  }, [map, waypoints, color, weight, opacity]);

  return null;
};

export default CustomRoutingMachine;
