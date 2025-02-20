import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";

// Import Data providers
import RoomTypeDataProvider from "./data_providers/RoomTypesDataProvider";
import routes from "./routes";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <RoomTypeDataProvider>
      <RouterProvider router={router} />
    </RoomTypeDataProvider>
  );
}

export default App;
