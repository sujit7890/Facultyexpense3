import React from "react";
import "./styles/FormCard.css";

const FormCard = ({ title, link }) => {
  return (
    <>
     

      <div className="formcard">
        <h2 className="formcard-title">{title}</h2>
        <a href={link} download className="formcard-btn">
          Download Form
        </a>
      </div>
    </>
  );
};

export default FormCard;
