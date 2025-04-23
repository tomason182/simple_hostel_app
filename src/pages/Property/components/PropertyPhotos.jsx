import styles from "./PropertyPhotos.module.css";
import { useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../hooks/useToast";
import Spinner from "../../../components/Spinner/Spinner";

export default function PropertyPhotos() {
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingImageUpload, setLoadingImageUpload] = useState(false);

  const { t } = useTranslation();
  const { addToast } = useToast();

  const inputFile = useRef(null);

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

  // Fetch images from the server
  const fetchImagesFromServer = useCallback(() => {
    const url = import.meta.env.VITE_URL_BASE + "/images/property";
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    setLoadingImages(true),
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
        .catch(err => {
          addToast({
            message: t(err.message, { ns: "validation" }),
            type: "error",
          });
        })
        .finally(() => setLoadingImages(false));
  }, []);

  useEffect(() => {
    fetchImagesFromServer();
  }, [fetchImagesFromServer]);

  // Remove images from SERVER or MEMORY.
  async function removeImage(id) {
    const imageToRemove = images.find(image => image.id === id);

    if (!imageToRemove) return;

    if (imageToRemove && imageToRemove?.src?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.src);
    }

    if (imageToRemove && imageToRemove?.source === "server") {
      try {
        const url =
          import.meta.env.VITE_URL_BASE + "/images/property/delete/" + id;
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
      } catch (err) {
        console.error(err);
        return;
      }
    }

    setImages(prev => prev.filter(image => image.id !== id));
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files);

    if (files.length + images.length >= 10) {
      alert("Maximum images allowed reached");
      return false;
    }

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

  function handleInputOpen() {
    if (images.length >= 10) {
      alert("Maximum images allowed reach");
      return;
    }
    if (inputFile && inputFile.current) {
      inputFile.current.click();
    }
  }

  // Function to upload images to the server
  function uploadImages() {
    const imagesToUpload = images.filter(img => img.source === "local");

    if (imagesToUpload.length === 0) {
      return alert(t("NO_IMAGE_TO_UPLOAD", { ns: "validation" }));
    }

    const formData = new FormData();
    imagesToUpload.forEach(image => {
      formData.append("photos", image.file);
    });

    const url = import.meta.env.VITE_URL_BASE + "/images/property/upload";
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

  if (loadingImages) return <Spinner />;

  return (
    <>
      <div className={styles.upload}>
        <label className={styles.uploadLabel}>
          <p>Select property images</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => handleFileChange(e)}
            disabled={loadingImages}
            ref={inputFile}
            max={10}
          />
          <button onClick={handleInputOpen} className={styles.inputButton}>
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
        </label>
      </div>
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
        <button onClick={() => uploadImages()} disabled={loadingImageUpload}>
          {t("save")}
        </button>
      </div>
    </>
  );
}
