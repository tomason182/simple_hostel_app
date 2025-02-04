import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Tabs from "./components/Tabs/Tabs";

function App() {
  const propertyName = "La Casa de Tomas";
  const user = {
    name: "Tomas",
  };

  const tabs = [
    { label: "home", content: <h1>Home page</h1> },
    { label: "calendar", content: <h1>Calendar page</h1> },
  ];
  return (
    <>
      <Header user={user} propertyName={propertyName} />
      <main>
        <Tabs tabs={tabs} />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default App;
