import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import tokenJson from "../assets/VotingERC20Token.json"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  blockNumber: number | string | undefined = 0;
  userWallet: Wallet | undefined;
  provider: ethers.providers.Provider | undefined
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
    })
  }

  clearBlock() {
    this.blockNumber = undefined
  }

}
