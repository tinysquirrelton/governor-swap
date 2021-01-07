import React, { Component } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import Logo from "../../assets/logos/governor-plain.png";
import { Menu, X, ChevronDown, ChevronUp } from "react-feather";
import "./style.scss";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSmall: null,
      isMedium: null,
      isLarge: null,
      isExpanded: null,
      isItemOpen: null,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("hashchange", this.hashHandler, false);

    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize());
    window.removeEventListener("hashchange", this.onResize());
  }

  onResize = () => {
    this.setState({
      isLarge: window.innerWidth >= 992,
      isMedium: window.innerWidth >= 768 && window.innerWidth < 992,
      isSmall: window.innerWidth < 768,
    });
  };

  hashHandler = () => {
    const id = window.location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView();
    }
  };

  onToggleDrawer = () => {
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));
  };

  onToggleAccordion = (item) => {
    if (this.state.isItemOpen === item) {
      this.setState({ isItemOpen: null });
    } else {
      this.setState({ isItemOpen: item });
    }
  };

  getLink = (item) => {
    return (
      <Link
        to={item.to}
        className="menu-item"
        onClick={() => {
          this.setState({ isExpanded: null, isItemOpen: null });
        }}
      >
        {item.title}
      </Link>
    );
  };

  getHash = (item) => {
    return (
      <HashLink
        to={item.to}
        className="menu-item"
        onClick={() => {
          this.setState({ isExpanded: null, isItemOpen: null });
        }}
      >
        {item.title}
      </HashLink>
    );
  };

  getApp = (item) => {
    return (
      <a
        href={item.to}
        className="menu-item"
        onClick={() => {
          this.setState({ isExpanded: null, isItemOpen: null });
        }}
      >
        {item.title}
      </a>
    );
  };

  render() {

    return (
      <div className="header-container">
        <div className="header-content">
          <a href="https://governordao.org" className="logo-container">
            <div className="logo-img">
              <img src={Logo} alt="logo" draggable={false} />
            </div>
            <div className="logo-title">Governor</div>
          </a>
        </div>
      </div>
    );
  }
}
