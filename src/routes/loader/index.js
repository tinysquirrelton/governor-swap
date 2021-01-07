import React from "react";
import Spinner from "../../assets/logos/governor-spinner.gif";
import "./style.scss";

export default () => {
  return (
    <div className="loader-container">
      <img className="loader-spinner" src={Spinner} alt="" />
    </div>
  );
};
