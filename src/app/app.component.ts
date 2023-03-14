import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import tokenJson from "../assets/VotingERC20Token.json"

const TOKEN_CONTRACT_URL = "http://localhost:3000/contracts-address";
const REQUEST_TOKENS_URL = "http://localhost:3000/request-tokens";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  blockNumber: number | string | undefined = 0;
  userWallet: Wallet | undefined;
  provider: ethers.providers.Provider | undefined
  userBalance: string | undefined
  userTokenBalance: string | undefined
  tokenContractAddress: string | undefined
  tokenSupply: string | undefined
  tokenContract: Contract | undefined;

  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider('goerli')
  }

  syncBlock() {
    this.blockNumber = "Loading..."
    // PROMISE. WHEN IT RESOLVES IT WILL SHOW.
    this.provider!.getBlock('latest').then((block) => {
      this.blockNumber = block.number
      // Returns an observable. It's similar to promise.
      // Observable feeds thing in app. You can subscribe to it and listen things.
      // Good to get async info once or multiple times.
      this.http.get<{ token: string }>(TOKEN_CONTRACT_URL).subscribe((answer) => {
        this.tokenContractAddress = answer.token;
        this.getTokenInfo();
      })
    })
  }
  getTokenInfo() {
    this.tokenContract = new Contract(this.tokenContractAddress!, tokenJson.abi, this.userWallet ?? this.provider)
    // Call methods in this weird way.
    // is a promise, use then.
    this.tokenContract['totalSupply']().then((totalSupply: BigNumber) => {
      const totalSupplyStr = ethers.utils.formatEther(totalSupply)
      this.tokenSupply = totalSupplyStr
    });
  }

  clearBlock() {
    this.blockNumber = undefined
  }

  createWallet() {
    this.userWallet = Wallet.createRandom().connect(this.provider!)
    this.userWallet.getBalance().then((balance) => {
      const balanceStr = ethers.utils.formatEther(balance)
      this.userBalance = balanceStr
    })

    this.tokenContract!['balanceOf'](this.userWallet.address).then((balance: BigNumber) => {
      const tokenBalanceStr = ethers.utils.formatEther(balance)
      this.userTokenBalance = tokenBalanceStr
    });

  }

  requestTokens(value: string) {
    console.log(value)
    console.log(this.userWallet!.address,)
    const body = { address: this.userWallet!.address, amount: Number(value) }
    this.http.post<any>(REQUEST_TOKENS_URL, body).subscribe((txReceipt) => {
      console.log(txReceipt)
    })
  }
}
