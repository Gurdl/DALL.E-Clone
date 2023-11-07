import React from "react";
import "./Modal.css";
import { useState, useRef } from "react";
function Modal(props) {
  const [error, setError] = useState(false);
  const[width,setWidth]=useState("");
  const[height,setHeight]=useState("");
  const ref = useRef(null);

  //   Cancel the image submission
  function cancelImage(e) {
    props.setModalOpen(false);
    props.setSelectedImage(null);
  }
  // submit the button:
  function checkSize() {
    setHeight(ref.current.height);
    setWidth(ref.current.width);
    if (ref.current.width === 256 && ref.current.height === 256) {
      // Generate the image:
      console.log(ref.current.width);
      console.log("generateee");
      props.generateVariations();
      setError(false);
    } else {
      console.log("width",ref.current.width);
      console.log("height",ref.current.height);
      setError(true);
    }
  }
  return (
    <div className="Modal">
      <div className="Image">
        <div className="Cancel-button">
          <button onClick={cancelImage} id="cancel">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="selected-Image">
          {props.selectedImage && (
            <img ref={ref} src={URL.createObjectURL(props.selectedImage)}></img>
          )}
        </div>
        <p>*Note:Set Image to 256 x 256 Always </p>
        <div className="generate">
          {error ? (
            <p className="sizing-error">"Error: Your Image is {width} X{height} "</p>
          ) : (
            <button id="submit" onClick={checkSize}>
              Generate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
