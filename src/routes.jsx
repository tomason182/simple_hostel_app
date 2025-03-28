import Layout from "./Layout";
import Home from "./pages/Home/Home";
import Calendar from "./pages/Calendar/Calendar";
import RatesAndAvailability from "./pages/RatesAndAvailability/RatesAndAvailability";
import Reservations from "./pages/Reservations/Reservations";
import Property from "./pages/Property/Property";
import Profile from "./pages/User/Profile";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "rates-and-availability",
        element: <RatesAndAvailability />,
      },
      {
        path: "reservations",
        element: <Reservations />,
      },
      {
        path: "property",
        element: <Property />,
      },
      {
        path: "inbox",
        element: <h1>Inbox Page</h1>,
      },
      {
        path: "my-website",
        element: <h1>My Website Page</h1>,
      },
      {
        path: "reports",
        element: <h1>Reports Page</h1>,
      },
      {
        path: "users/profile",
        element: <Profile />,
      },
    ],
  },
];

export default routes;
