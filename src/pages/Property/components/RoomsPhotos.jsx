import { useCallback, useContext, useEffect, useState } from "react";
import { RoomTypeContext } from "../../../data_providers/RoomTypesDataProvider";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./RoomsPhotos.module.css";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../hooks/useToast";

export default function RoomsPhotos() {
  const [room, setRoom] = useState({ id: "" });
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingImageUpload, setLoadingImageUpload] = useState(false);
  const { roomTypes, isLoading, error } = useContext(RoomTypeContext);

  const { t } = useTranslation();
  const { addToast } = useToast();

  // Revoke image URL when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.source === "local") {
          URL.revokeObjectURL(image.src);
        }
      });
    };
  }, []);

  const fetchImagesFromServer = useCallback(() => {
    if (!room?.id) return;

    const url = import.meta.env.VITE_URL_BASE + "/images/room-types/" + room.id;
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    setLoadingImages(true);
    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("IMAGE_LOAD_FAIL");
        }
        return response.json();
      })
      .then(data => {
        const serverImages = data.map((image, index) => ({
          id: image.id,
          src: import.meta.env.VITE_IMAGES_STATIC_URL + image.file_name,
          name: `image-${index + 1}`,
          source: "server",
        }));
        setImages(serverImages);
      })
      .catch(e => {
        addToast({
          message: t(e.message, { ns: "validation" }),
          type: "error",
        });
        console.error(`Error loading images: ${e.message}`);
      })
      .finally(() => setLoadingImages(false));
  }, [room?.id]);

  useEffect(() => {
    fetchImagesFromServer();
  }, [fetchImagesFromServer]);

  function handleRoomSelection(e) {
    const roomId = parseInt(e.target.value);
    images.forEach(image => {
      if (image.source === "local") {
        URL.revokeObjectURL(image.src);
      }
      setImages([]);
    });
    if (isNaN(roomId)) {
      setRoom({ id: "" });
      return;
    }
    const selectedRoom = roomTypes.find(r => r.id === roomId);
    setRoom({ id: selectedRoom.id });
  }

  // Handling images
  function handleFileChange(event) {
    const files = Array.from(event.target.files);

    files.forEach((file, i) => {
      if (/\.(jpe?g|png)/i.test(file.name)) {
        const imageURL = URL.createObjectURL(file);

        setImages(prev => [
          ...prev,
          {
            id: Date.now() + i,
            src: imageURL,
            name: file.name,
            source: "local",
            file,
          },
        ]);
      }
    });
  }

  async function removeImage(id) {
    // Find the removed image and revoke its URL
    const imageToRemove = images.find(image => image.id === id);

    if (!imageToRemove) return;

    if (imageToRemove && imageToRemove?.src?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.src);
    }

    if (imageToRemove && imageToRemove?.source === "server") {
      try {
        const url =
          import.meta.env.VITE_URL_BASE + "/images/room-types/delete/" + id;
        const options = {
          mode: "cors",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        };

        const response = await fetch(url, options);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.msg);
        }

        addToast({
          message: t("IMAGE_DELETED", { ns: "validation" }),
          type: "success",
        });
      } catch (e) {
        console.error(e);
        return;
      }
    }

    setImages(prev => prev.filter(image => image.id !== id));
  }

  function uploadImages() {
    const imagesToUpload = images.filter(img => img.source === "local");
    if (imagesToUpload.length === 0)
      return alert(t("NO_IMAGE_TO_UPLOAD", { ns: "validation" }));
    if (!room.id)
      return alert(t("NO_ROOM_TYPE_SELECTED", { ns: "validation" }));

    const formData = new FormData();

    imagesToUpload.forEach(image => {
      formData.append("photos", image.file);
    });

    const roomTypeId = room.id; // Checkear que el ID del room  type este ahi!
    const url =
      import.meta.env.VITE_URL_BASE + "/images/room-types/upload/" + roomTypeId;
    const options = {
      mode: "cors",
      method: "POST",
      credentials: "include",
      body: formData,
    };

    setLoadingImageUpload(true);

    fetch(url, options)
      .then(response => {
        if (response.status === 401) {
          throw new Error("USER_UNAUTHORIZED");
        }
        if (response.status >= 400) {
          throw new Error("UNEXPECTED_ERROR");
        }
        addToast({
          message: t("IMAGE_UPLOADED", { ns: "validation" }),
          type: "success",
        });
        // We need to clean all temporally URLs
        imagesToUpload.forEach(image => URL.revokeObjectURL(image.src));
        // We need to fetch the images from the server.
        fetchImagesFromServer();
      })
      .catch(e =>
        addToast({ message: t(e.message, { ns: "validation" }), type: "error" })
      )
      .finally(() => {
        setLoadingImageUpload(false);
        images.forEach(image => {
          if (image.source === "local") {
            URL.revokeObjectURL(image.src);
          }
        });
      });
  }

  if (isLoading || loadingImages) return <Spinner />;

  if (error) return <p>Network error. Please, try again</p>;

  if (roomTypes.length === 0) return <p>{t("no_room_types_message")}</p>;

  return (
    <>
      {/* Room type selection */}
      <label>
        <select
          name="room"
          onChange={e => handleRoomSelection(e)}
          value={room.id}
        >
          <option value="">Select a room type</option>
          {roomTypes.map(room => (
            <option key={room.id} value={room.id}>
              {room.description}
            </option>
          ))}
        </select>
      </label>

      {/* Upload container */}
      <div className={styles.upload}>
        <label className={styles.uploadLabel}>
          <button className={styles.uploadContent}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3" />
            </svg>
            <span>Click to upload Images</span>
            <span>You can upload upto 10 images per room type</span>
          </button>
          <input
            type="file"
            multiple
            accept="image/*"
            className={styles.hidden}
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Grid Container for displaying images */}
      <div className={styles.imagesGrid}>
        {images.map(image => (
          <div key={image.id} className={styles.imageContainer}>
            <img src={image.src} alt={image.name} className={styles.image} />
            <button
              onClick={() => removeImage(image.id)}
              className={styles.deleteBtn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.submitBtn}
          disabled={loadingImageUpload}
          onClick={uploadImages}
        >
          {loadingImageUpload ? "loading" : t("save")}
        </button>
      </div>
    </>
  );
}
