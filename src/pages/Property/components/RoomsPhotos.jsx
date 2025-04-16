import { useCallback, useContext, useEffect, useState } from "react";
import { RoomTypeContext } from "../../../data_providers/RoomTypesDataProvider";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./RoomsPhotos.module.css";

export default function RoomsPhotos() {
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingImageUpload, setLoadingImageUpload] = useState(false);
  const { roomTypes, isLoading, error } = useContext(RoomTypeContext);

  console.log(images);

  console.log("Room: ", room);

  const refreshImageFromServer = useCallback(() => {
    if (!room?.id) return;

    const url = import.meta.VITE_URL_BASE + "/images/" + room.id;
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
          alert("Failed to load images from server");
          return;
        }
        return response.json();
      })
      .then(data => {
        const serverImages = data.map((url, index) => ({
          id: `server-${index}`,
          src: url,
          name: `image-${index}`,
          source: "server",
        }));
        setImages(serverImages);
      })
      .catch(e => {
        console.error(`Error loading images: ${e.message}`);
      })
      .finally(() => setLoadingImages(false));
  }, [room?.id]);

  useEffect(() => {
    refreshImageFromServer();
  }, [refreshImageFromServer]);

  function handleRoomSelection(e) {
    const roomId = parseInt(e.target.value);
    const selectedRoom = roomTypes.find(r => r.id === roomId);
    setRoom(selectedRoom);
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

  function removeImage(id) {
    setImages(prev => {
      const updatedImages = prev.filter(image => image.id !== id);

      // Find the removed image and revoke its URL
      const removedImage = prev.find(image => image.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.src);
      }

      return updatedImages;
    });
  }

  function uploadImages() {
    const imagesToUpload = images.filter(img => img.source === "local");
    if (imagesToUpload.length === 0) return alert("No images to upload");

    const formData = new FormData();

    imagesToUpload.forEach(image => {
      formData.append("photos", image.file);
    });

    const roomTypeId = room.id; // Checkear que el ID del room  type este ahi!
    const url = import.meta.env.VITE_URL_BASE + "/images/upload/" + roomTypeId;
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
          alert("User Unauthorized");
          // Redirect to login page or home page
          return;
        }
        if (response.status >= 400) {
          alert("Unable to upload images. Please try again.");
          return;
        }
        alert("Images uploaded successfully");
        // We need to clean all temporally URLs
        imagesToUpload.forEach(image => URL.revokeObjectURL(image.src));
        // We need to fetch the images from the server.
        refreshImageFromServer();
      })
      .catch(e => alert(`An error Occurred: ${e.message}`))
      .finally(() => setLoadingImageUpload(false));
  }

  if (isLoading || loadingImages) return <Spinner />;

  if (error) return <p>Network error. Please, try again</p>;

  if (roomTypes.length === 0)
    return <p>No room types found. Please, create your room type first.</p>;

  return (
    <>
      <h3>Rooms Photos</h3>
      {/* Room type selection */}
      <label>
        <select name="room" onChange={e => handleRoomSelection(e)}>
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
          <div className={styles.uploadContent}>
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
          </div>
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
            <img src={image.src} alt={image.name} className={styles} />
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
      <div>
        <button
          className={styles.submitBtn}
          disabled={loadingImageUpload}
          onClick={uploadImages}
        >
          {loadingImageUpload ? "loading" : "Upload"}
        </button>
      </div>
    </>
  );
}
