import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Tabs from "./components/Tabs/Tabs";
import Home from "./pages/Home/Home";

function App() {
  const propertyName = "La Casa de Tomas";
  const user = {
    name: "Tomas",
  };

  const tabs = [
    { label: "home", content: <Home /> },
    { label: "calendar", content: <h1>Calendar page</h1> },
    {
      label: "Rates & Availability",
      content: <h1>Rates and Availability Page</h1>,
    },
    { label: "Reservations", content: <h1>Reservation Page</h1> },
    { label: "Property", content: <h1>Property Page</h1> },
    { label: "Inbox", content: <h1>Inbox Page</h1> },
    { label: "My Website", content: <h1>My website Page</h1> },
    { label: "Reports", content: <h1>Reports Page</h1> },
  ];
  return (
    <>
      <Header user={user} propertyName={propertyName} />
      <main>
        <Tabs tabs={tabs} />
      </main>
      <Footer />
    </>
  );
}

export default App;
