import React, { Component } from "react";
import Web3 from "web3";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { ConnectButton } from "./elements";

import "./style.scss";

class Swap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSmall: null,
      isMedium: null,
      isLarge: null,
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
    this.LPABI = [
      {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        constant: true,
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "burn",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    this.LPAddress = "0x4d184bf6f805ee839517164d301f0c4e5d25c374";
    this.LPContract = null;
    this.SLPABI = [
      {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        constant: true,
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "burn",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    this.SLPAddress = "0xcced3780fba37761646962b2997d40b94de33954";
    this.SLPContract = null;
    this.swapContract = null;
    this.swapContractAddress = "0xcc23ef76b46ed576caa5a1481f4400d2543f8006";
    this.swapContractABI = [
      {
        inputs: [
          { internalType: "address", name: "_synthetico", type: "address" },
          { internalType: "address", name: "_authentico", type: "address" },
          { internalType: "uint256", name: "_inicio", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "_purchaser",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "_tokens",
            type: "uint256",
          },
        ],
        name: "purchased",
        type: "event",
      },
      {
        inputs: [],
        name: "authentico",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "inicio",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "purchase",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "synthetico",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    this.swapStartTimestamp = 1608652800;
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

  componentDidMount() {
    window.addEventListener("resize", this.onResize.bind(this));
    this.onResize();
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

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize());
  }

  onResize = () => {
    this.setState({
      isLarge: window.innerWidth >= 992,
      isMedium: window.innerWidth >= 768 && window.innerWidth < 992,
      isSmall: window.innerWidth < 768,
    });
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

  setDisconnection = () => {
    this.web3 = null;
    this.setState({ account: null, isConnected: false, isDropdownOpen: false });
    this.LPContract = null;
    this.swapContract = null;
    this.statsInterval != null
      ? clearInterval(this.statsInterval)
      : (this.statsInterval = null);
  };

  render() {
    return (
      <div className="max-width-container">
        <div className="airdrop-container">
          <div className="airdrop-title">
            {this.state.isLarge ? (
              <>
                <div className="title-text">sLP to LP Swap</div>
                <ConnectButton
                  account={this.state.account}
                  isDropdownOpen={this.state.isDropdownOpen}
                  setConnection={this.setConnection}
                  setDisconnection={this.setDisconnection}
                />
              </>
            ) : (
              <>
                <ConnectButton
                  account={this.state.account}
                  isDropdownOpen={this.state.isDropdownOpen}
                  setConnection={this.setConnection}
                  setDisconnection={this.setDisconnection}
                />
                <div className="title-text">sLP to LP Swap</div>
              </>
            )}
          </div>
          <div className="airdrop-subtitle">
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

          <div className="airdrop-details">
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
