// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/ReactToastify.css";
// import { Provider } from "react-redux";
// import store from "./Redux/Store/store.js";
// import socketService from "./services/socketService";

// socketService.initializeSocket(store);
// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Provider store={store}>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//       <App />
//     </Provider>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Provider } from "react-redux";
import store, { persistor } from "./Redux/Store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import socketService from "./services/socketService";

// Initialize any socket services with the store
socketService.initializeSocket(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          // Optionally dispatch setAuthChecked(true)
          store.dispatch({ type: "user/setAuthChecked", payload: true });
        }}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
