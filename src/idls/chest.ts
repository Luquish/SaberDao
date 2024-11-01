export type ChestIDL = {
  version: "0.2.1";
  name: "chestprogram";
  instructions: [
    {
      name: "initState";
      accounts: [
        {
          name: "manager";
          isMut: false;
          isSigner: true;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stateSigner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "nonce";
          type: "u8";
        },
        {
          name: "signerNonce";
          type: "u8";
        }
      ];
    },
    {
      name: "updateManager";
      accounts: [
        {
          name: "manager";
          isMut: false;
          isSigner: true;
        },
        {
          name: "newManager";
          isMut: false;
          isSigner: false;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "initChestMarket";
      accounts: [
        {
          name: "manager";
          isMut: false;
          isSigner: true;
        },
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stateSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "oracle";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "chestType";
          type: {
            defined: "ChestType";
          };
        },
        {
          name: "assetIsSol";
          type: "bool";
        },
        {
          name: "decimals";
          type: "u8";
        },
        {
          name: "maxDeposits";
          type: "u64";
        },
        {
          name: "performanceFee";
          type: "u16";
        },
        {
          name: "managementFee";
          type: "u16";
        }
      ];
    },
    {
      name: "updateChestMarket";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "manager";
          isMut: false;
          isSigner: true;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "maxDeposits";
          type: {
            option: "u64";
          };
        },
        {
          name: "performanceFee";
          type: {
            option: "u16";
          };
        },
        {
          name: "managementFee";
          type: {
            option: "u16";
          };
        },
        {
          name: "oracle";
          type: {
            option: "publicKey";
          };
        }
      ];
    },
    {
      name: "initChest";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stateSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "manager";
          isMut: false;
          isSigner: true;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "newChest";
          isMut: true;
          isSigner: true;
        },
        {
          name: "contractMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "closeTs";
          type: "u64";
        }
      ];
    },
    {
      name: "closeAndInitChest";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stateSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "manager";
          isMut: false;
          isSigner: true;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "newChest";
          isMut: true;
          isSigner: true;
        },
        {
          name: "chestToClose";
          isMut: true;
          isSigner: false;
        },
        {
          name: "contractMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "closeTs";
          type: "u64";
        }
      ];
    },
    {
      name: "defineChest";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "manager";
          isMut: false;
          isSigner: true;
        },
        {
          name: "chest";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "expiryTs";
          type: "u64";
        },
        {
          name: "strike";
          type: "u64";
        },
        {
          name: "maxPremium";
          type: "u64";
        }
      ];
    },
    {
      name: "fundChest";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stateSigner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "contractTokenAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "chest";
          isMut: true;
          isSigner: false;
        },
        {
          name: "contractMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "contracts";
          type: "u64";
        }
      ];
    },
    {
      name: "activateChest";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "manager";
          isMut: false;
          isSigner: true;
        },
        {
          name: "chest";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "resolveChest";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "chest";
          isMut: true;
          isSigner: false;
        },
        {
          name: "prevChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "pythOracle";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "exerciseChest";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stateSigner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "chest";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "contractTokenAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "contractMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "initUser";
      accounts: [
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "userAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "nonce";
          type: "u8";
        }
      ];
    },
    {
      name: "deposit";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stateSigner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: false;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "prevChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "lockedChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "lockedPrevChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "startChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "startPrevChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdraw";
      accounts: [
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stateSigner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: false;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nextChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "prevChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "lockedChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "lockedPrevChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "startChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "startPrevChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "withdrawChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "withdrawPrevChest";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "sweepFees";
      accounts: [
        {
          name: "manager";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenAcc";
          isMut: true;
          isSigner: false;
        },
        {
          name: "markets";
          isMut: true;
          isSigner: false;
        },
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stateSigner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "Chest";
      type: {
        kind: "struct";
        fields: [
          {
            name: "state";
            type: {
              defined: "ChestState";
            };
          },
          {
            name: "prevChest";
            type: "publicKey";
          },
          {
            name: "closeTs";
            type: "u64";
          },
          {
            name: "contractMint";
            type: "publicKey";
          },
          {
            name: "mintedContracts";
            type: "u64";
          },
          {
            name: "accruedPremium";
            type: "u64";
          },
          {
            name: "expiryTs";
            type: {
              option: "u64";
            };
          },
          {
            name: "maxPremium";
            type: {
              option: "u64";
            };
          },
          {
            name: "strike";
            type: {
              option: "u64";
            };
          },
          {
            name: "maxPayout";
            type: {
              option: "u64";
            };
          },
          {
            name: "yieldIndex";
            type: {
              option: "u64";
            };
          }
        ];
      };
    },
    {
      name: "Markets";
      type: {
        kind: "struct";
        fields: [
          {
            name: "chestMarkets";
            type: {
              array: [
                {
                  defined: "ChestMarket";
                },
                10
              ];
            };
          }
        ];
      };
    },
    {
      name: "State";
      type: {
        kind: "struct";
        fields: [
          {
            name: "nonce";
            type: "u8";
          },
          {
            name: "signerNonce";
            type: "u8";
          },
          {
            name: "manager";
            type: "publicKey";
          },
          {
            name: "chestMarkets";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "User";
      type: {
        kind: "struct";
        fields: [
          {
            name: "nonce";
            type: "u8";
          },
          {
            name: "lockedChest";
            type: {
              array: ["publicKey", 10];
            };
          },
          {
            name: "lockedAmount";
            type: {
              array: ["u64", 10];
            };
          },
          {
            name: "startChest";
            type: {
              array: ["publicKey", 10];
            };
          },
          {
            name: "startAmount";
            type: {
              array: ["u64", 10];
            };
          },
          {
            name: "toWithdraw";
            type: {
              array: ["u64", 10];
            };
          },
          {
            name: "withdrawableAfter";
            type: {
              array: ["publicKey", 10];
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "ChestMarket";
      type: {
        kind: "struct";
        fields: [
          {
            name: "chestType";
            type: {
              defined: "ChestType";
            };
          },
          {
            name: "nextChest";
            type: "publicKey";
          },
          {
            name: "activeChest";
            type: "publicKey";
          },
          {
            name: "prevChest";
            type: "publicKey";
          },
          {
            name: "assetIsSol";
            type: "bool";
          },
          {
            name: "decimals";
            type: "u8";
          },
          {
            name: "vault";
            type: "publicKey";
          },
          {
            name: "oracle";
            type: "publicKey";
          },
          {
            name: "maxDeposits";
            type: "u64";
          },
          {
            name: "totalLocked";
            type: "u64";
          },
          {
            name: "totalFree";
            type: "u64";
          },
          {
            name: "totalDeclareOut";
            type: "u64";
          },
          {
            name: "totalOut";
            type: "u64";
          },
          {
            name: "performanceFee";
            type: "u16";
          },
          {
            name: "managementFee";
            type: "u16";
          },
          {
            name: "accruedFees";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "ChestState";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Depositing";
          },
          {
            name: "Defining";
          },
          {
            name: "Funding";
          },
          {
            name: "Active";
          },
          {
            name: "Resolved";
          }
        ];
      };
    },
    {
      name: "ChestType";
      type: {
        kind: "enum";
        variants: [
          {
            name: "CoveredCall";
          },
          {
            name: "PutSelling";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "OutOfChestMarkets";
      msg: "No more space for chest markets";
    },
    {
      code: 6001;
      name: "InvalidChestMarket";
      msg: "Invalid chest market";
    },
    {
      code: 6002;
      name: "InvalidNextChest";
      msg: "Invalid next chest";
    },
    {
      code: 6003;
      name: "MathFailure";
      msg: "Math error";
    },
    {
      code: 6004;
      name: "InvalidExpiryTime";
      msg: "Invalid expiry time";
    },
    {
      code: 6005;
      name: "ChestClosed";
      msg: "Chest is closed for deposits";
    },
    {
      code: 6006;
      name: "ChestUndefined";
      msg: "Chest is undefined";
    },
    {
      code: 6007;
      name: "InvalidChestState";
      msg: "Chest state is invalid";
    },
    {
      code: 6008;
      name: "ExceededMaxContracts";
      msg: "Exceeded Max mintable Contracts";
    },
    {
      code: 6009;
      name: "ContractMintingClosed";
      msg: "Contract minting is closed";
    },
    {
      code: 6010;
      name: "InvalidPrevChest";
      msg: "Invalid previous chest";
    },
    {
      code: 6011;
      name: "InvalidLockedAmount";
      msg: "Invalid locked amount";
    },
    {
      code: 6012;
      name: "ChestNotResolved";
      msg: "Chest is not resolved yet";
    },
    {
      code: 6013;
      name: "InvalidActiveChest";
      msg: "Invalid active chest";
    },
    {
      code: 6014;
      name: "ChestNotClosed";
      msg: "Chest not closed yet";
    },
    {
      code: 6015;
      name: "NoPayout";
      msg: "Chest has no payout";
    },
    {
      code: 6016;
      name: "MaxDepositsReached";
      msg: "Market has reached its max deposits";
    },
    {
      code: 6017;
      name: "InvalidOracle";
      msg: "Invalid oracle key";
    },
    {
      code: 6018;
      name: "InvalidLockedChest";
      msg: "Invalid locked chest";
    },
    {
      code: 6019;
      name: "InvalidStartChest";
      msg: "Invalid start chest";
    },
    {
      code: 6020;
      name: "InvalidWithdrawChest";
      msg: "Invalid withdraw chest";
    },
    {
      code: 6021;
      name: "InvalidMint";
      msg: "Invalid mint";
    },
    {
      code: 6022;
      name: "NotExpired";
      msg: "Chest is not expired yet";
    },
    {
      code: 6023;
      name: "InvalidArgument";
      msg: "An argument passed was invalid";
    }
  ];
};
export const ChestJSON: ChestIDL = {
  version: "0.2.1",
  name: "chestprogram",
  instructions: [
    {
      name: "initState",
      accounts: [
        {
          name: "manager",
          isMut: false,
          isSigner: true,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stateSigner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "nonce",
          type: "u8",
        },
        {
          name: "signerNonce",
          type: "u8",
        },
      ],
    },
    {
      name: "updateManager",
      accounts: [
        {
          name: "manager",
          isMut: false,
          isSigner: true,
        },
        {
          name: "newManager",
          isMut: false,
          isSigner: false,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "initChestMarket",
      accounts: [
        {
          name: "manager",
          isMut: false,
          isSigner: true,
        },
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stateSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "oracle",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "chestType",
          type: {
            defined: "ChestType",
          },
        },
        {
          name: "assetIsSol",
          type: "bool",
        },
        {
          name: "decimals",
          type: "u8",
        },
        {
          name: "maxDeposits",
          type: "u64",
        },
        {
          name: "performanceFee",
          type: "u16",
        },
        {
          name: "managementFee",
          type: "u16",
        },
      ],
    },
    {
      name: "updateChestMarket",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "manager",
          isMut: false,
          isSigner: true,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "maxDeposits",
          type: {
            option: "u64",
          },
        },
        {
          name: "performanceFee",
          type: {
            option: "u16",
          },
        },
        {
          name: "managementFee",
          type: {
            option: "u16",
          },
        },
        {
          name: "oracle",
          type: {
            option: "publicKey",
          },
        },
      ],
    },
    {
      name: "initChest",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stateSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "manager",
          isMut: false,
          isSigner: true,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "newChest",
          isMut: true,
          isSigner: true,
        },
        {
          name: "contractMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "closeTs",
          type: "u64",
        },
      ],
    },
    {
      name: "closeAndInitChest",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stateSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "manager",
          isMut: false,
          isSigner: true,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "newChest",
          isMut: true,
          isSigner: true,
        },
        {
          name: "chestToClose",
          isMut: true,
          isSigner: false,
        },
        {
          name: "contractMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "closeTs",
          type: "u64",
        },
      ],
    },
    {
      name: "defineChest",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "manager",
          isMut: false,
          isSigner: true,
        },
        {
          name: "chest",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "expiryTs",
          type: "u64",
        },
        {
          name: "strike",
          type: "u64",
        },
        {
          name: "maxPremium",
          type: "u64",
        },
      ],
    },
    {
      name: "fundChest",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stateSigner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "contractTokenAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "chest",
          isMut: true,
          isSigner: false,
        },
        {
          name: "contractMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "contracts",
          type: "u64",
        },
      ],
    },
    {
      name: "activateChest",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "manager",
          isMut: false,
          isSigner: true,
        },
        {
          name: "chest",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "resolveChest",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "chest",
          isMut: true,
          isSigner: false,
        },
        {
          name: "prevChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pythOracle",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "exerciseChest",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stateSigner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "chest",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "contractTokenAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "contractMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "initUser",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "nonce",
          type: "u8",
        },
      ],
    },
    {
      name: "deposit",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stateSigner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: false,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "prevChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lockedChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lockedPrevChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "startChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "startPrevChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdraw",
      accounts: [
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stateSigner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: false,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nextChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "prevChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lockedChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lockedPrevChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "startChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "startPrevChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "withdrawChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "withdrawPrevChest",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "sweepFees",
      accounts: [
        {
          name: "manager",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenAcc",
          isMut: true,
          isSigner: false,
        },
        {
          name: "markets",
          isMut: true,
          isSigner: false,
        },
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stateSigner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Chest",
      type: {
        kind: "struct",
        fields: [
          {
            name: "state",
            type: {
              defined: "ChestState",
            },
          },
          {
            name: "prevChest",
            type: "publicKey",
          },
          {
            name: "closeTs",
            type: "u64",
          },
          {
            name: "contractMint",
            type: "publicKey",
          },
          {
            name: "mintedContracts",
            type: "u64",
          },
          {
            name: "accruedPremium",
            type: "u64",
          },
          {
            name: "expiryTs",
            type: {
              option: "u64",
            },
          },
          {
            name: "maxPremium",
            type: {
              option: "u64",
            },
          },
          {
            name: "strike",
            type: {
              option: "u64",
            },
          },
          {
            name: "maxPayout",
            type: {
              option: "u64",
            },
          },
          {
            name: "yieldIndex",
            type: {
              option: "u64",
            },
          },
        ],
      },
    },
    {
      name: "Markets",
      type: {
        kind: "struct",
        fields: [
          {
            name: "chestMarkets",
            type: {
              array: [
                {
                  defined: "ChestMarket",
                },
                10,
              ],
            },
          },
        ],
      },
    },
    {
      name: "State",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nonce",
            type: "u8",
          },
          {
            name: "signerNonce",
            type: "u8",
          },
          {
            name: "manager",
            type: "publicKey",
          },
          {
            name: "chestMarkets",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "User",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nonce",
            type: "u8",
          },
          {
            name: "lockedChest",
            type: {
              array: ["publicKey", 10],
            },
          },
          {
            name: "lockedAmount",
            type: {
              array: ["u64", 10],
            },
          },
          {
            name: "startChest",
            type: {
              array: ["publicKey", 10],
            },
          },
          {
            name: "startAmount",
            type: {
              array: ["u64", 10],
            },
          },
          {
            name: "toWithdraw",
            type: {
              array: ["u64", 10],
            },
          },
          {
            name: "withdrawableAfter",
            type: {
              array: ["publicKey", 10],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "ChestMarket",
      type: {
        kind: "struct",
        fields: [
          {
            name: "chestType",
            type: {
              defined: "ChestType",
            },
          },
          {
            name: "nextChest",
            type: "publicKey",
          },
          {
            name: "activeChest",
            type: "publicKey",
          },
          {
            name: "prevChest",
            type: "publicKey",
          },
          {
            name: "assetIsSol",
            type: "bool",
          },
          {
            name: "decimals",
            type: "u8",
          },
          {
            name: "vault",
            type: "publicKey",
          },
          {
            name: "oracle",
            type: "publicKey",
          },
          {
            name: "maxDeposits",
            type: "u64",
          },
          {
            name: "totalLocked",
            type: "u64",
          },
          {
            name: "totalFree",
            type: "u64",
          },
          {
            name: "totalDeclareOut",
            type: "u64",
          },
          {
            name: "totalOut",
            type: "u64",
          },
          {
            name: "performanceFee",
            type: "u16",
          },
          {
            name: "managementFee",
            type: "u16",
          },
          {
            name: "accruedFees",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "ChestState",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Depositing",
          },
          {
            name: "Defining",
          },
          {
            name: "Funding",
          },
          {
            name: "Active",
          },
          {
            name: "Resolved",
          },
        ],
      },
    },
    {
      name: "ChestType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "CoveredCall",
          },
          {
            name: "PutSelling",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "OutOfChestMarkets",
      msg: "No more space for chest markets",
    },
    {
      code: 6001,
      name: "InvalidChestMarket",
      msg: "Invalid chest market",
    },
    {
      code: 6002,
      name: "InvalidNextChest",
      msg: "Invalid next chest",
    },
    {
      code: 6003,
      name: "MathFailure",
      msg: "Math error",
    },
    {
      code: 6004,
      name: "InvalidExpiryTime",
      msg: "Invalid expiry time",
    },
    {
      code: 6005,
      name: "ChestClosed",
      msg: "Chest is closed for deposits",
    },
    {
      code: 6006,
      name: "ChestUndefined",
      msg: "Chest is undefined",
    },
    {
      code: 6007,
      name: "InvalidChestState",
      msg: "Chest state is invalid",
    },
    {
      code: 6008,
      name: "ExceededMaxContracts",
      msg: "Exceeded Max mintable Contracts",
    },
    {
      code: 6009,
      name: "ContractMintingClosed",
      msg: "Contract minting is closed",
    },
    {
      code: 6010,
      name: "InvalidPrevChest",
      msg: "Invalid previous chest",
    },
    {
      code: 6011,
      name: "InvalidLockedAmount",
      msg: "Invalid locked amount",
    },
    {
      code: 6012,
      name: "ChestNotResolved",
      msg: "Chest is not resolved yet",
    },
    {
      code: 6013,
      name: "InvalidActiveChest",
      msg: "Invalid active chest",
    },
    {
      code: 6014,
      name: "ChestNotClosed",
      msg: "Chest not closed yet",
    },
    {
      code: 6015,
      name: "NoPayout",
      msg: "Chest has no payout",
    },
    {
      code: 6016,
      name: "MaxDepositsReached",
      msg: "Market has reached its max deposits",
    },
    {
      code: 6017,
      name: "InvalidOracle",
      msg: "Invalid oracle key",
    },
    {
      code: 6018,
      name: "InvalidLockedChest",
      msg: "Invalid locked chest",
    },
    {
      code: 6019,
      name: "InvalidStartChest",
      msg: "Invalid start chest",
    },
    {
      code: 6020,
      name: "InvalidWithdrawChest",
      msg: "Invalid withdraw chest",
    },
    {
      code: 6021,
      name: "InvalidMint",
      msg: "Invalid mint",
    },
    {
      code: 6022,
      name: "NotExpired",
      msg: "Chest is not expired yet",
    },
    {
      code: 6023,
      name: "InvalidArgument",
      msg: "An argument passed was invalid",
    },
  ],
};
