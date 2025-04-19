import { Outlet } from "react-router";
import Header from "./components/Header/Header";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
// Import Data providers
import RoomTypeDataProvider from "./data_providers/RoomTypesDataProvider";
import UserProfileProvider from "./data_providers/UserProfileProvider";

export default function Layout() {
  return (
    <>
      <UserProfileProvider>
        <RoomTypeDataProvider>
          <Header />
          <NavBar />
          <main>
            <Outlet />
          </main>
          <Footer />
        </RoomTypeDataProvider>
      </UserProfileProvider>
    </>
  );
}
