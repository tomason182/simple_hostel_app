import SecondaryTabs from "../../components/Tabs/SecondaryTabs";
import PropertyInfo from "./components/PropertyInfo";
import Users from "./components/Users";
import RoomTypes from "./components/RoomTypes";
import RoomsPhotos from "./components/RoomsPhotos";
import Policies from "./components/Policies";
import Amenities from "./components/Amenities";

import { useTranslation } from "react-i18next";

// Fetch property data
import usePropertyDataProvider from "../../data_providers/PropertyDataProvider";

export default function Property() {
  const { propertyData, isLoading, error, refreshPropertyData } =
    usePropertyDataProvider();

  const { t } = useTranslation();

  const tabs = [
    {
      label: t("property_info"),
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
      label: t("users"),
      content: <Users />,
    },
    {
      label: t("room_types"),
      content: <RoomTypes />,
    },
    {
      label: t("photos"),
      content: <RoomsPhotos />,
    },
    {
      label: t("policies"),
      content: (
        <Policies
          policies={propertyData.policies}
          isLoading={isLoading}
          error={error}
        />
      ),
    },
    {
      label: t("room_amenities"),
      content: <Amenities />,
    },
  ];

  return <SecondaryTabs tabs={tabs} />;
}
