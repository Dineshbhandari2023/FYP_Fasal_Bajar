import socketService from "./socketService";
import store from "../Redux/Store/store";

// Initialize socket service with Redux store
export const initializeSocketService = () => {
  socketService.initializeSocket(store);

  // Return the socket service for any additional configuration
  return socketService;
};

// Export the initialized socket service
export default socketService;
