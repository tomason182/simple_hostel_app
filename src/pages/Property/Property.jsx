import SecondaryTabs from "../../components/Tabs/SecondaryTabs";
import PropertyInfo from "./components/PropertyInfo";
import Users from "./components/Users";
import RoomTypes from "./components/RoomTypes";
import RoomsPhotos from "./components/RoomsPhotos";
import Policies from "./components/Policies";

// Fetch property data
import usePropertyDataProvider from "../../data_providers/PropertyDataProvider";

export default function Property() {
  const { propertyData, isLoading, error, refreshPropertyData } =
    usePropertyDataProvider();

  console.log(propertyData);

  const tabs = [
    {
      label: "Property Info",
      content: (
        <PropertyInfo
          propertyData={propertyData}
          loadingPropertyData={isLoading}
          propertyError={error}
          refreshPropertyData={refreshPropertyData}
        />
      ),
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
      content: (
        <Policies
          policies={propertyData.policies}
          isLoading={isLoading}
          error={error}
        />
      ),
    },
    {
      label: "Room amenities",
      content: <h1>Rooms amenities</h1>,
    },
  ];

  return <SecondaryTabs tabs={tabs} />;
}
