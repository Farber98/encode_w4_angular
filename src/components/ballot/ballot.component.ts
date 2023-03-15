import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import ballotJson from "../../assets/TokenizedBallot.json"

const BALLOT_CONTRACT_URL = "http://localhost:3000/contracts-address";

class Proposal {
  name: string | undefined;
  voteCount: string | undefined;

  constructor(name: string, voteCount: string) {
    this.name = name
    this.voteCount = voteCount
  }
}


@Component({
  selector: 'ballot',
  templateUrl: './ballot.component.html',
  providers: []
})
export class BallotComponent {
  walletSigner: ethers.providers.JsonRpcSigner | undefined;
  provider: ethers.providers.Web3Provider | undefined
  ballotContractAddress: string | undefined
  ballotContract: Contract | undefined;
  winnerName: string | undefined;
  votingPower: string | undefined
  walletAddress: string | undefined;
  proposals: Proposal[] | undefined;
  blockId: any;


  constructor(private http: HttpClient) {
    this.provider = new ethers.providers.Web3Provider(
      window.ethereum,
      'any'
    )

    this.http.get<{ ballot: string }>(BALLOT_CONTRACT_URL).subscribe((answer) => {
      this.ballotContractAddress = answer.ballot;

    })
    this.proposals = []
  }


  getBallotInfo() {
    window.ethereum.request({ method: 'eth_requestAccounts' }).then((address: any) => {
      this.walletAddress = address[0]
      this.walletSigner = this.provider!.getSigner(this.walletAddress)
      this.ballotContract = new Contract(this.ballotContractAddress!, ballotJson.abi, this.walletSigner)
    })

    // Call methods in this weird way.
    // is a promise, use then.
    this.ballotContract!['winnerName']().then((winner: ethers.BytesLike) => {
      const winnerNameStr = ethers.utils.parseBytes32String(winner)
      this.winnerName = winnerNameStr
    });

    this.ballotContract!['blockId']().then((blockId: any) => {
      this.blockId = blockId
    });

    this.ballotContract!['votingPower'](this.walletSigner?._address).then((votingPower: BigNumber) => {
      const votingPowerStr = ethers.utils.formatEther(votingPower)
      this.votingPower = votingPowerStr
    });


    for (let index = 0; index < 3; index++) {
      this.ballotContract!['proposals'](index).then((proposal: any) => {
        const proposalName = ethers.utils.parseBytes32String(proposal[0])
        const proposalVotes = ethers.utils.formatEther(proposal[1])
        this.proposals![index] = new Proposal(proposalName, proposalVotes)
      });
    }
  }

  sync() {
    this.getBallotInfo()
  }

  vote(proposalIndex: string, amount: string) {
    const proposalIndexBN = ethers.BigNumber.from(Number(proposalIndex) - 1)
    const amountBN = ethers.utils.parseEther(amount)
    this.ballotContract!['vote'](proposalIndexBN, amountBN).then((txReceipt: any) => {
      console.log(txReceipt)
    })
  }
}
