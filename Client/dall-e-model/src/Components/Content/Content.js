import React from "react";
import "./Content.css";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";
import { useState, useEffect } from "react";
function Content() {
  const [images, setImages] = useState([]);
  const [prompt, setprompt] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [numberOfImages, setnumberOfImages] = useState("2");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const SurpeiseImages = [
    "an oil painting by Matisse of a humanoid robot playing chess",
    "a stern-looking owl dressed as a librarian, digital art",
    "synthwave sports car",
    "an oil painting portrait of a capybara wearing medieval royal robes and an ornate crown on a dark background",
  ];
  const surpriseMe = () => {
    setImages([]);
    const randomValue =
      SurpeiseImages[Math.floor(Math.random() * SurpeiseImages.length)];
    setprompt(randomValue);
  };
  useEffect(() => {
    console.log("selected image", selectedImage);
  }, [selectedImage, modalOpen]); // This effect will run whenever selectedImage changes

  /*
  This generate function generates the number of images as acoording to the given prompt by user.
  const URL = "http://localhost:3080/ImageGenerate" -> On this URl the prompt is send and images are 
  responded back 
  */
  const handleGenerate = async (e) => {
    setImages(null);
    e.preventDefault();
    setLoader(true);
    if (prompt == "") {
      setError("Must Have a search term!");
      setLoader(false);
      return;
    }

    try {
      setError("");
      const URL = "http://localhost:3080/ImageGenerate";
      const options = {
        method: "post",
        body: JSON.stringify({
          prompt: prompt,
          n: parseInt(numberOfImages),
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await fetch(URL, options);
      const data = await response.json();
      setImages(data);
      setLoader(false);
      setprompt("");
    } catch (error) {
      console.log(error);
    }
  };
  console.log("Prompt is ", prompt);

  /*
  This function only upload the images on the backend, It has no connections with open-ai 
  image variations api.So This function only stores the images on the backend
  */
  const uploadImage = async (e) => {
    setModalOpen(true);
    console.log(e.target.files[0]);
    setSelectedImage(e.target.files[0]);
    // Attach the file with form data:
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    console.log("selected image", selectedImage);
    e.target.files = null;
    // Send Images to backend:
    try {
      const URL = "http://localhost:3080/Upload";

      const options = {
        method: "POST",
        body: formData,
      };

      const resp = await fetch(URL, options);
      const data = await resp.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  /*
  This function is used to generate the varitios of the uploaded images;
  */
  async function generateVariations() {
    setModalOpen(false);
    setLoader(true);
    try {
      const URL = "http://localhost:3080/variations";
      console.log("Number of images are", numberOfImages);
      const Options = {
        method: "POST",
        body: JSON.stringify({
          n: parseInt(numberOfImages),
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await fetch(URL, Options);
      const data = await response.json();
      console.log(data);
      setImages(data);
      setError("");
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Content">
      <section className="Search-Section">
        <p>
          Start with a detailed description{" "}
          <span className="surprise" onClick={surpriseMe}>
            Surprise Me
          </span>
        </p>
        <div className="Input-Container">
          <input
            placeholder="An Impressionist Oil painting of Sunflowers in a purple vase"
            value={prompt}
            required
            onChange={(e) => setprompt(e.target.value)}
          ></input>
          <button onClick={handleGenerate}>Generate</button>
        </div>
        <div className="Number-Of-Images">
          <span>Choose Number of Pictures</span>
          <select onChange={(e) => setnumberOfImages(e.target.value)}>
            Select Number Of images
            <option>Select an Option</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <div className="Upload-Images">
          <p>
            <label htmlFor="fileUpload" className="uploadHeading">
              + Upload Images{" "}
            </label>
            <input
              onChange={uploadImage}
              type="file"
              id="fileUpload"
              name="file"
            ></input>
            <span className="toEdit"> to Edit</span>
          </p>
        </div>
      </section>
      {loader ? (
        <Loader></Loader>
      ) : (
        <>
          {error ? (
            <p className="Error-Message">{error}</p>
          ) : (
            <>
              {modalOpen ? (
                <Modal
                  setModalOpen={setModalOpen}
                  setSelectedImage={setSelectedImage}
                  selectedImage={selectedImage}
                  generateVariations={generateVariations}
                ></Modal>
              ) : (
                <section className="Images-Container">
                  {images.map((image, index) => {
                    return (
                      <img
                        key={index}
                        src={image.url}
                        alt={`generated Images are :${prompt}`}
                      ></img>
                    );
                  })}
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Content;
