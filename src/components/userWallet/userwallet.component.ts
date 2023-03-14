import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import tokenJson from "../../assets/VotingERC20Token.json"

const TOKEN_CONTRACT_URL = "http://localhost:3000/contracts-address";
const REQUEST_TOKENS_URL = "http://localhost:3000/request-tokens";

/* trick ts window ethereum */
declare global {
  interface Window {
    ethereum: any;
  }
}
@Component({
  selector: 'user-wallet',
  templateUrl: './userwallet.component.html',
  styleUrls: []
})
export class UserWalletComponent {
  //userWallet: Wallet | undefined;
  walletSigner: ethers.providers.JsonRpcSigner | undefined;
  provider: ethers.providers.Web3Provider | undefined
  userBalance: string | undefined
  userTokenBalance: string | undefined
  tokenContractAddress: string | undefined
  tokenSupply: string | undefined
  tokenContract: Contract | undefined;
  chainId: number | undefined;
  connectedAccount: any;
  walletAddress: string | undefined;

  constructor(private http: HttpClient) {
    this.http.get<{ token: string }>(TOKEN_CONTRACT_URL).subscribe((answer) => {
      this.tokenContractAddress = answer.token;
    })

    this.provider = new ethers.providers.Web3Provider(
      window.ethereum,
      'any'
    )


  }

  getWalletInfo() {
    this.walletSigner!.getBalance().then((balance) => {
      const balanceStr = ethers.utils.formatEther(balance)
      this.userBalance = balanceStr
    })

    this.tokenContract!['balanceOf'](this.walletSigner?._address).then((balance: BigNumber) => {
      const tokenBalanceStr = ethers.utils.formatEther(balance)
      this.userTokenBalance = tokenBalanceStr
    });

  }

  connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        window.ethereum.request({ method: 'eth_requestAccounts' }).then((address: any) => {
          this.walletAddress = address[0]
          this.walletSigner = this.provider!.getSigner(this.walletAddress)
          this.tokenContract = new Contract(this.tokenContractAddress!, tokenJson.abi, this.walletSigner)
          //this.userWallet = accounts[0] // Account address that you had imported
          this.getWalletInfo()
        });
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
  }

  async changeWallet() {
    const walletAddress = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {}
        }
      ]
    });

    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {}
        }
      ]
    });
  }

  async isConnected() {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      this.walletAddress = accounts[0]
      this.walletSigner = this.provider!.getSigner(accounts[0])
      this.tokenContract = new Contract(this.tokenContractAddress!, tokenJson.abi, this.walletSigner)
      alert(`You're connected to: ${accounts[0]}`);
      this.getWalletInfo()
    } else {
      this.connectWallet();
    }
  }

  requestTokens(value: string) {
    const body = { address: this.walletSigner?._address, amount: Number(value) }
    this.http.post<any>(REQUEST_TOKENS_URL, body).subscribe((txReceipt) => {
      console.log(txReceipt)
    })
  }

}
