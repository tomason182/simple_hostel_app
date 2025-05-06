import SecondaryTabs from "../../components/Tabs/SecondaryTabs";
import PropertyInfo from "./components/PropertyInfo";
import Users from "./components/Users";
import RoomTypes from "./components/RoomTypes";
import RoomsPhotos from "./components/RoomsPhotos";
import PropertyPhotos from "./components/PropertyPhotos";
import Taxes from "./components/Taxes";
import BreakfastSettings from "./components/BreakfastSettings";
import Policies from "./components/Policies";
import Amenities from "./components/Amenities";
import Facilities from "./components/Facilities";
import { useContext } from "react";

import { useTranslation } from "react-i18next";

// Fetch property data
import usePropertyDataProvider from "../../data_providers/PropertyDataProvider";
import { RoomTypeContext } from "../../data_providers/RoomTypesDataProvider";

export default function Property() {
  const { propertyData, isLoading, error, refreshPropertyData } =
    usePropertyDataProvider();

  const { roomTypes, loadingRoomTypes, errorRoomTypes, refreshRoomTypeData } =
    useContext(RoomTypeContext);

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
      content: (
        <RoomTypes
          roomTypes={roomTypes}
          isLoading={loadingRoomTypes}
          error={errorRoomTypes}
          refreshRoomTypeData={refreshRoomTypeData}
        />
      ),
    },
    {
      label: t("photos"),
      subTabs: [
        {
          label: t("property"),
          content: <PropertyPhotos />,
        },
        {
          label: t("room_types"),
          content: <RoomsPhotos />,
        },
      ],
    },
    {
      label: t("taxes_fees"),
      content: <Taxes />,
    },
    {
      label: t("breakfast_meals"),
      content: <BreakfastSettings />,
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
      content: (
        <Amenities
          roomTypes={roomTypes}
          loadingRoomTypes={loadingRoomTypes}
          errorRoomTypes={errorRoomTypes}
          refreshRoomTypeData={refreshRoomTypeData}
        />
      ),
    },
    {
      label: t("facilities_services"),
      content: <Facilities />,
    },
  ];

  return <SecondaryTabs tabs={tabs} />;
}
