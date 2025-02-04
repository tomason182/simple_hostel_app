import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  const propertyName = "La Casa de Tomas";
  const user = {
    name: "Tomas",
  };
  return (
    <>
      <Header user={user} propertyName={propertyName} />
      <main>This is the body</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default App;
