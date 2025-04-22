import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import ToastProvider from "./components/Toast/ToastProvider";

import routes from "./routes";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
