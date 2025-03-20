import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";

// Import Data providers
import RoomTypeDataProvider from "./data_providers/RoomTypesDataProvider";
import UserProfileProvider from "./data_providers/UserProfileProvider";
import routes from "./routes";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <UserProfileProvider>
      <RoomTypeDataProvider>
        <RouterProvider router={router} />
      </RoomTypeDataProvider>
    </UserProfileProvider>
  );
}

export default App;
