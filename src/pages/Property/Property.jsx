import SecondaryTabs from "../../components/Tabs/SecondaryTabs";
import PropertyInfo from "./components/PropertyInfo";
import Users from "./components/Users";
import RoomTypes from "./components/RoomTypes";
import RoomsPhotos from "./components/RoomsPhotos";
import Policies from "./components/Policies";

export default function Property() {
  const tabs = [
    {
      label: "Property Info",
      content: <PropertyInfo />,
    },
    {
      label: "Users",
      content: <Users />,
    },
    {
      label: "Room Types",
      content: <RoomTypes />,
    },
    {
      label: "Photos",
      content: <RoomsPhotos />,
    },
    {
      label: "Policies",
      content: <Policies />,
    },
    {
      label: "Room amenities",
      content: <h1>Rooms amenities</h1>,
    },
  ];

  return <SecondaryTabs tabs={tabs} />;
}
