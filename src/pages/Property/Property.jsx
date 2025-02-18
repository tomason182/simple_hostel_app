import SecondaryTabs from "../../components/Tabs/SecondaryTabs";
import PropertyInfo from "./components/PropertyInfo";
import Users from "./components/Users";
import RoomTypes from "./components/RoomTypes";
import RoomsPhotos from "./components/RoomsPhotos";
import Policies from "./components/Policies";

// Fetch property data
import usePropertyDataProvider from "../../data_providers/PropertyDataProvider";
// Fetch team members
import useUsersDataProvider from "../../data_providers/UsersDataProvider";

export default function Property() {
  const { propertyData, isLoading, error } = usePropertyDataProvider();
  const { usersData, usersLoading, usersError } = useUsersDataProvider();

  const tabs = [
    {
      label: "Property Info",
      content: (
        <PropertyInfo
          propertyData={propertyData}
          loadingPropertyData={isLoading}
          propertyError={error}
          usersData={usersData}
          loadingUsersData={usersLoading}
          usersError={usersError}
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
      content: <Policies />,
    },
    {
      label: "Room amenities",
      content: <h1>Rooms amenities</h1>,
    },
  ];

  return <SecondaryTabs tabs={tabs} />;
}
