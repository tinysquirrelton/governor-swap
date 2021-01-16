import React, { Component } from "react";
import Web3 from "web3";
import { toast } from "react-toastify";
import { ConnectButton } from "./elements";

// * ABI
import { LPABI } from "../../data/abi/LPABI";
import { sLPABI } from "../../data/abi/sLPABI";
import { swapContractABI } from "../../data/abi/swapContractABI";

// * CONSTANTS
import {
  LPAddress,
  SLPAddress,
  swapContractAddress,
} from "../../data/constants";

import "./style.scss";

class Swap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      isDropdownOpen: false,
      account: null,
      day: 0,
      percentage: 0,
      unclaimed: 0,
      claimed: 0,
      userSLP: 0,
      userSLPRaw: 0,
      claimable: 0,
      SLPAllowance: 0,
      isSwapLive: false,
      countdownString: "0:0:0:0",
    };
    // ABI
    this.LPABI = LPABI;
    this.SLPABI = sLPABI;
    this.swapContractABI = swapContractABI;
    // Address
    this.LPAddress = "0x4d184bf6f805ee839517164d301f0c4e5d25c374";
    this.SLPAddress = "0xcced3780fba37761646962b2997d40b94de33954";
    this.swapContractAddress = "0xcc23ef76b46ed576caa5a1481f4400d2543f8006";
    // Contract
    this.LPContract = LPAddress;
    this.SLPContract = SLPAddress;
    this.swapContract = swapContractAddress;
    this.swapStartTimestamp = 1608652800;
  }

  componentDidMount() {
    this.onAccountChange();
    this.onNetworkChange();

    let now = new Date().getTime();
    let startCountdown = this.swapStartTimestamp * 1000;
    let self = this;
    if (startCountdown > now) {
      let countdownInterval = setInterval(function () {
        let now = new Date().getTime();
        let distance = startCountdown - now;

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        let calculatedCountdownString =
          days + ":" + hours + ":" + minutes + ":" + seconds;
        self.setState({ countdownString: calculatedCountdownString });

        if (distance < 0) {
          self.setState({ isSwapLive: true });
          clearInterval(countdownInterval);
        }
      }, 1000);
    } else {
      this.setState({ isSwapLive: true });
    }
  }

  roundTo = (n, digits) => {
    var negative = false;
    if (digits === undefined) {
      digits = 0;
    }
    if (n < 0) {
      negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(digits);
    if (negative) {
      n = (n * -1).toFixed(digits);
    }
    return n;
  };

  getWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable().then((accounts) => {
          this.connectMainnet(accounts);
        });
      } catch (err) {
        console.log(err);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      this.web3 = new Web3(Web3.currentProvider);
      try {
        await this.web3.eth.getAccounts().then((accounts) => {
          this.connectMainnet(accounts);
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  connectMainnet = async (accounts) => {
    await this.web3?.eth?.getChainId().then((x) => {
      if (x === 1) {
        this.setState({ account: accounts[0].toString(), isConnected: true });

        this.SLPContract = new this.web3.eth.Contract(
          this.SLPABI,
          this.SLPAddress
        );
        this.LPContract = new this.web3.eth.Contract(
          this.LPABI,
          this.LPAddress
        );
        this.swapContract = new this.web3.eth.Contract(
          this.swapContractABI,
          this.swapContractAddress
        );

        this.getSwapStats();
        var self = this;
        this.statsInterval = setInterval(function () {
          self.getSwapStats();
        }, 10000);
      } else {
        this.setState({ account: null });
        toast.error("You need to be on the Ethereum Mainnet");
      }
    });
  };

  getSwapStats = () => {
    if (this.SLPContract != null && this.LPContract != null) {
      this.SLPContract.methods
        .balanceOf(this.state.account)
        .call()
        .then((result) => {
          this.setState({
            userSLP: parseFloat(this.web3.utils.fromWei(result, "ether")),
            userSLPRaw: result,
          });
        });
      this.LPContract.methods
        .balanceOf(this.swapContractAddress)
        .call()
        .then((result) => {
          this.setState({
            unclaimed: parseFloat(this.web3.utils.fromWei(result, "ether")),
          });
        });
      this.SLPContract.methods
        .balanceOf(this.swapContractAddress)
        .call()
        .then((result) => {
          this.setState({
            claimed: parseFloat(this.web3.utils.fromWei(result, "ether")),
          });
        });
      this.SLPContract.methods
        .allowance(this.state.account, this.swapContractAddress)
        .call()
        .then((result) => {
          this.setState({ SLPAllowance: result });
        });
    }
  };

  approveContract = () => {
    if (this.web3 != null && this.SLPContract != null) {
      this.SLPContract.methods
        .approve(this.swapContractAddress, this.state.userSLPRaw)
        .send({
          from: this.state.account,
        })
        .on("error", function (error) {
          toast.error("Transaction was not successful");
        })
        .on("transactionHash", function (transactionHash) {
          toast.info(
            "Your transaction has been recorded. Click here to review your tx.",
            {
              onClick: function () {
                window.open(
                  "https://etherscan.io/tx/" + transactionHash,
                  "_blank"
                );
              },
            }
          );
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          toast.success(
            "You have approved the swap contract to spend your sLP"
          );
          this.getSwapStats();
        });
    }
  };

  swapTokens = () => {
    if (this.web3 != null && this.swapContract != null) {
      this.swapContract.methods
        .purchase(this.state.userSLPRaw)
        .send({
          from: this.state.account,
        })
        .on("error", function (error) {
          toast.error("Transaction was not successful");
        })
        .on("transactionHash", function (transactionHash) {
          toast.info(
            "Your transaction has been recorded. Click here to review your tx.",
            {
              onClick: function () {
                window.open(
                  "https://etherscan.io/tx/" + transactionHash,
                  "_blank"
                );
              },
            }
          );
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          toast.success("You have successfully exchanged your sLP tokens");
          this.getSwapStats();
        });
    }
  };

  onAccountChange() {
    window?.ethereum?.on("accountsChanged", (accounts) => {
      if (
        accounts.length > 0 &&
        this.state.account !== accounts[0].toString()
      ) {
        this.setState({ account: accounts[0].toString() });
      } else {
        this.setState({ account: null });
      }
    });
  }

  onNetworkChange() {
    window?.ethereum?.on("chainChanged", (chainId) => window.location.reload());
  }

  setConnection = () => {
    if (
      this.state.isConnected &&
      this.web3.utils.isAddress(this.state.account)
    ) {
      this.setState((prevState) => ({
        isDropdownOpen: !prevState.isDropdownOpen,
      }));
    } else {
      this.getWeb3();
    }
  };

  render() {
    return (
      <div className="max-width-container">
        <div className="swap-container">
          <div className="swap-title">
            <div className="title-text">sLP to LP Swap</div>
            <ConnectButton
              account={this.state.account}
              setConnection={this.setConnection}
            />
          </div>
          <div className="swap-subtitle">
            <a
              href="https://etherscan.io/address/0xcc23ef76b46ed576caa5a1481f4400d2543f8006#code"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: "0.8em",
                color: "#ffffff",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              Swap Contract
            </a>
          </div>

          <div className="swap-details">
            <div className="upper">
              <div className="details-item">
                <div className="title">Unclaimed LP</div>
                <div className="value">
                  {this.state.unclaimed.toLocaleString()}
                </div>
              </div>
              <div className="details-item">
                <div className="title">Claimed LP</div>
                <div className="value">
                  {this.state.claimed.toLocaleString()}
                </div>
              </div>
              <div className="details-item">
                <div className="title">sLP in your wallet</div>
                <div className="value">
                  {this.state.userSLP.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="lower">
              {this.state.isSwapLive ? (
                this.state.isConnected ? (
                  <>
                    <div className="claim-item">
                      <div className="title">
                        You're about to claim{" "}
                        {this.state.userSLP.toLocaleString()} LP
                      </div>
                    </div>
                    {this.state.userSLP >= this.state.SLPAllowance ? (
                      <button
                        className="claim-btn"
                        onClick={this.approveContract}
                      >
                        Approve
                      </button>
                    ) : (
                      <button className="claim-btn" onClick={this.swapTokens}>
                        Swap tokens
                      </button>
                    )}
                  </>
                ) : (
                  <div className="claim-disconnected">
                    <span>Wallet not connected</span>
                    <br />
                    Please, connect wallet to continue...
                  </div>
                )
              ) : (
                <>
                  <div className="claim-item">
                    <div className="title">The swap starts in</div>
                    <div className="title" id="countdownToStart">
                      {this.state.countdownString}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="gdao-texture-bg" />
        <div className="gdao-phoenix-bg" />
      </div>
    );
  }
}

export default Swap;
