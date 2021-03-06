export const swapContractABI = [
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
