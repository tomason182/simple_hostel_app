import styles from "./Property.module.css";
import SecondaryTabs from "../../components/Tabs/SecondaryTabs";
import PropertyInfo from "./components/PropertyInfo";

export default function Property() {
  const tabs = [
    {
      label: "Property Info",
      content: <PropertyInfo />,
    },
    {
      label: "Users",
      content: <h1>Property Users</h1>,
    },
    {
      label: "Room Types",
      content: <h1>Room Types</h1>,
    },
    {
      label: "Photos",
      content: <h1>Property fotos</h1>,
    },
    {
      label: "Policies",
      content: <h1>Property policies</h1>,
    },
    {
      label: "Room amenities",
      content: <h1>Rooms amenities</h1>,
    },
  ];

  return <SecondaryTabs tabs={tabs} />;
}
