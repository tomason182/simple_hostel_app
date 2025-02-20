import "./App.css";
import Header from "./components/Header/Header";
import NavBar from "./components/NavBar/NavBar";
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
  return (
    <>
      <Header user={user} propertyName={propertyName} />
      <NavBar />
      <main>
        <RoomTypeDataProvider></RoomTypeDataProvider>
      </main>
      <Footer />
    </>
  );
}

export default App;
