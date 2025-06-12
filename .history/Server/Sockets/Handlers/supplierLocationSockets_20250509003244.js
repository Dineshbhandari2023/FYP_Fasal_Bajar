const setupSupplierLocationSocket = (io) => {
  const connectedSuppliers = new Map();
  const locationNamespace = io.of("/location");

  locationNamespace.on("connection", (socket) => {
    console.log(`Client connected to location namespace: ${socket.id}`);
 
    socket.on("supplier:register", (data) => {
      const { supplierId, username, serviceArea } = data;

      if (!supplierId) {
        return socket.emit("error", { message: "Supplier ID is required" });
      }
   
      connectedSuppliers.set(supplierId, {
        socketId: socket.id,
        username: username || "Unknown Supplier",
        serviceArea: serviceArea || "Not specified",
        lastLocation: null,
        lastUpdated: null,
        isActive: true,
      });
     
      socket.join(`supplier:${supplierId}`);

      console.log(`Supplier ${supplierId} registered for location tracking`);
    
      locationNamespace.emit("supplier:status", {
        supplierId,
        username: connectedSuppliers.get(supplierId).username,
        isActive: true,
        timestamp: new Date().toISOString(),
      });

      const activeSuppliers = Array.from(connectedSuppliers.entries())
        .filter(([_, data]) => data.isActive && data.lastLocation)
        .map(([id, data]) => ({
          supplierId: id,
          username: data.username,
          serviceArea: data.serviceArea,
          latitude: data.lastLocation?.latitude,
          longitude: data.lastLocation?.longitude,
          lastUpdated: data.lastUpdated,
          isActive: data.isActive,
        }));

      socket.emit("supplier:active-list", activeSuppliers);
    });

    socket.on("supplier:location", (data) => {
      const { supplierId, latitude, longitude, heading, speed } = data;
      if (!supplierId || latitude === undefined || longitude === undefined) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      const timestamp = new Date().toISOString();
      if (connectedSuppliers.has(supplierId)) {
        const supplierData = connectedSuppliers.get(supplierId);
        connectedSuppliers.set(supplierId, {
          ...supplierData,
          lastLocation: {
            latitude,
            longitude,
            heading: heading || null,
            speed: speed || null,
          },
          lastUpdated: timestamp,
          isActive: true,
        });
      } else {
        connectedSuppliers.set(supplierId, {
          socketId: socket.id,
          username: "Unknown Supplier",
          lastLocation: {
            latitude,
            longitude,
            heading: heading || null,
            speed: speed || null,
          },
          lastUpdated: timestamp,
          isActive: true,
        });
        socket.join(`supplier:${supplierId}`);
      }
  
      locationNamespace.emit("supplier:location", {
        supplierId,
        latitude,
        longitude,
        heading: heading || null,
        speed: speed || null,
        timestamp,
      });

      console.log(`Location update from supplier ${supplierId}:`, {
        latitude,
        longitude,
      });
    });
    socket.on("supplier:offline", (data) => {
      const { supplierId } = data;

      if (supplierId && connectedSuppliers.has(supplierId)) {
        const supplierData = connectedSuppliers.get(supplierId);
        connectedSuppliers.set(supplierId, {
          ...supplierData,
          isActive: false,
        });
        locationNamespace.emit("supplier:status", {
          supplierId,
          username: supplierData.username,
          isActive: false,
          timestamp: new Date().toISOString(),
        });

        console.log(`Supplier ${supplierId} marked as offline`);
      }
    });
   
    socket.on("supplier:get-active", () => {
      const activeSuppliers = Array.from(connectedSuppliers.entries())
        .filter(([_, data]) => data.isActive && data.lastLocation)
        .map(([id, data]) => ({
          supplierId: id,
          username: data.username,
          serviceArea: data.serviceArea,
          latitude: data.lastLocation?.latitude,
          longitude: data.lastLocation?.longitude,
          heading: data.lastLocation?.heading,
          speed: data.lastLocation?.speed,
          lastUpdated: data.lastUpdated,
          isActive: data.isActive,
        }));

      socket.emit("supplier:active-list", activeSuppliers);
    });
  
    socket.on("disconnect", () => {
      for (const [supplierId, data] of connectedSuppliers.entries()) {
        if (data.socketId === socket.id) {
          connectedSuppliers.set(supplierId, {
            ...data,
            isActive: false,
            disconnectedAt: new Date().toISOString(),
          });
          locationNamespace.emit("supplier:status", {
            supplierId,
            username: data.username,
            isActive: false,
            timestamp: new Date().toISOString(),
          });

          console.log(`Supplier ${supplierId} disconnected`);
          break;
        }
      }

      console.log(`Client disconnected from location namespace: ${socket.id}`);
    });
  });
  const getActiveSuppliers = () => {
    return Array.from(connectedSuppliers.entries())
      .filter(([_, data]) => data.isActive)
      .map(([id, data]) => ({
        supplierId: id,
        username: data.username,
        serviceArea: data.serviceArea,
        location: data.lastLocation,
        lastUpdated: data.lastUpdated,
      }));
  };

  const getSupplierLocation = (supplierId) => {
    if (connectedSuppliers.has(supplierId)) {
      const data = connectedSuppliers.get(supplierId);
      return {
        supplierId,
        username: data.username,
        location: data.lastLocation,
        lastUpdated: data.lastUpdated,
        isActive: data.isActive,
      };
    }
    return null;
  };

  setInterval(() => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    for (const [supplierId, data] of connectedSuppliers.entries()) {
      if (!data.isActive && data.disconnectedAt) {
        const disconnectedAt = new Date(data.disconnectedAt);
        if (disconnectedAt < thirtyMinutesAgo) {
          connectedSuppliers.delete(supplierId);
          console.log(`Removed inactive supplier ${supplierId} from memory`);
        }
      }
    }
  }, 30 * 60 * 1000);

  return {
    namespace: locationNamespace,
    getActiveSuppliers,
    getSupplierLocation,
  };
};

module.exports = setupSupplierLocationSocket;
