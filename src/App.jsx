import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Tabs from "./components/Tabs/Tabs";
// Import Pages
import Home from "./pages/Home/Home";
import Calendar from "./pages/Calendar/Calendar";
import RatesAndAvailability from "./pages/RatesAndAvailability/RatesAndAvailability";
import Reservations from "./pages/Reservations/Reservations";
import Property from "./pages/Property/Property";

// Import Data providers
import RoomTypeDataProvider from "./data_providers/RoomTypesDataProvider";

function App() {
  const propertyName = "La Casa de Tomas";
  const user = {
    name: "Tomas",
  };

  const tabs = [
    { label: "home", content: <Home /> },
    { label: "calendar", content: <Calendar /> },
    {
      label: "Rates & Availability",
      content: <RatesAndAvailability />,
    },
    { label: "Reservations", content: <Reservations /> },
    { label: "Property", content: <Property /> },
    { label: "Inbox", content: <h1>Inbox Page</h1> },
    { label: "My Website", content: <h1>My website Page</h1> },
    { label: "Reports", content: <h1>Reports Page</h1> },
  ];
  return (
    <>
      <Header user={user} propertyName={propertyName} />
      <main>
        <RoomTypeDataProvider>
          <Tabs tabs={tabs} />
        </RoomTypeDataProvider>
      </main>
      <Footer />
    </>
  );
}

export default App;
