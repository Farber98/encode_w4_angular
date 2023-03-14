import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import tokenJson from "../../assets/VotingERC20Token.json"

const TOKEN_CONTRACT_URL = "http://localhost:3000/contracts-address";
const REQUEST_TOKENS_URL = "http://localhost:3000/request-tokens";
@Component({
  selector: 'user-wallet',
  templateUrl: './userwallet.component.html',
  styleUrls: []
})
export class UserWalletComponent {
  userWallet: Wallet | undefined;
  provider: ethers.providers.Provider | undefined
  userBalance: string | undefined
  userTokenBalance: string | undefined
  tokenContractAddress: string | undefined
  tokenSupply: string | undefined
  tokenContract: Contract | undefined;

  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider('goerli')
    this.http.get<{ token: string }>(TOKEN_CONTRACT_URL).subscribe((answer) => {
      this.tokenContractAddress = answer.token;
    })

  }

  createWallet() {
    this.userWallet = Wallet.createRandom().connect(this.provider!)
    this.userWallet.getBalance().then((balance) => {
      const balanceStr = ethers.utils.formatEther(balance)
      this.userBalance = balanceStr
    })

    this.tokenContract = new Contract(this.tokenContractAddress!, tokenJson.abi, this.userWallet ?? this.provider)


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
