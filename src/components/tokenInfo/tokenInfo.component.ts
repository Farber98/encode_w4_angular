import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import tokenJson from "../../assets/VotingERC20Token.json"

const TOKEN_CONTRACT_URL = "http://localhost:3000/contracts-address";

@Component({
  selector: 'token-info',
  templateUrl: './tokenInfo.component.html',
  styleUrls: []
})
export class TokenInfoComponent {
  provider: ethers.providers.Provider | undefined
  tokenContractAddress: string | undefined
  tokenSupply: string | undefined
  tokenContract: Contract | undefined;
  name: string | undefined
  symbol: string | undefined
  decimals: number | undefined



  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider('goerli')
    this.http.get<{ token: string }>(TOKEN_CONTRACT_URL).subscribe((answer) => {
      this.tokenContractAddress = answer.token;
    })

  }


  getTokenInfo() {
    this.tokenContract = new Contract(this.tokenContractAddress!, tokenJson.abi, this.provider)
    // Call methods in this weird way.
    // is a promise, use then.
    this.tokenContract!['totalSupply']().then((totalSupply: BigNumber) => {
      const totalSupplyStr = ethers.utils.formatEther(totalSupply)
      this.tokenSupply = totalSupplyStr
    });

    this.tokenContract!['name']().then((name: string) => {
      this.name = name
    });

    this.tokenContract!['symbol']().then((symbol: string) => {
      this.symbol = symbol
    });

    this.tokenContract!['decimals']().then((decimals: number) => {
      this.decimals = decimals
    });
  }

  sync() {
    this.getTokenInfo()
  }


}
