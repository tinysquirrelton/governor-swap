import React, { Component } from "react";
import { Provider } from "react-redux";
import { store } from "./data/store";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import { X } from "react-feather";

const Close = ({ closeToast }) => <X size={20} onClick={closeToast} />;

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ToastContainer
          position={"bottom-right"}
          autoClose={3000}
          closeButton={<Close />}
          pauseOnFocusLoss={false}
          draggable={true}
          draggablePercent={25}
        />
        <Routes />
      </Provider>
    );
  }
}
