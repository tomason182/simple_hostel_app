import { Outlet } from "react-router";
import Header from "./components/Header/Header";
import NavBar from "./components/NavBar/NavBar";

export default function Layout() {
  return (
    <>
      <Header />
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
