import { useState, useEffect } from "react";

const RealTimeLocationTracker = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState(5000); // Default: 5 seconds
  const [trackingTimeout, setTrackingTimeout] = useState(null);

  useEffect(() => {
    if (isTracking) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => stopTracking(); // Cleanup on unmount
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
    trackLocation();
  };

  const stopTracking = () => {
    setIsTracking(false);
    clearTimeout(trackingTimeout);
    setTrackingTimeout(null);
  };

  const trackLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      handlePositionError,
      {
        enableHighAccuracy: true,
        timeout: 30000, // Increase timeout to 30 seconds
        maximumAge: 0,
      }
    );
  };

  const handlePositionSuccess = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    setError(null);

    // Schedule next tracking attempt
    if (isTracking) {
      const nextTrackingTimeout = setTimeout(() => {
        trackLocation();
      }, trackingInterval);
      setTrackingTimeout(nextTrackingTimeout);
    }
  };

  const handlePositionError = (error) => {
    console.error("Error getting location:", error);

    // Log specific error based on error code
    let errorMessage = "Could not get your location.";
    if (error.code === 1) {
      errorMessage = "Location access denied. Please enable location services.";
    } else if (error.code === 2) {
      errorMessage = "Location unavailable. Please try again later.";
    } else if (error.code === 3) {
      errorMessage = "Location request timed out. Will retry later.";
    }

    console.warn(errorMessage);

    // Continue tracking attempts even after failure
    setIsTracking(true);

    // Schedule next tracking attempt
    const nextTrackingTimeout = setTimeout(() => {
      startTracking();
    }, trackingInterval);

    setTrackingTimeout(nextTrackingTimeout);
  };

  return (
    <div>
      <h1>Real-Time Location Tracker</h1>
      {latitude && longitude && (
        <p>
          Latitude: {latitude}, Longitude: {longitude}
        </p>
      )}
      {error && <p>Error: {error}</p>}
      <button onClick={() => setIsTracking(!isTracking)}>
        {isTracking ? "Stop Tracking" : "Start Tracking"}
      </button>
    </div>
  );
};

export default RealTimeLocationTracker;
