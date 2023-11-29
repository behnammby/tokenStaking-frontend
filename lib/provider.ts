import Config from '../config';
import { ethers } from 'ethers';

const apiKey = process.env.INFURA_API_KEY;
if (apiKey === undefined) {
  throw new Error('Infura API key is not set.')
}

export class ChainSdk { 
  private static _provider: ethers.Provider;
  private static _tokenContract: ethers.Contract;
  private static _stakingContratc: ethers.Contract;

  static {
    const provider = new ethers.InfuraProvider(Config.chainId, apiKey);
    this._provider = provider;

    const tokenContract = new ethers.Contract(Config.tokenAddress, Config.tokenAbi, this._provider);
    this._tokenContract = tokenContract;

    const stakingContract = new ethers.Contract(Config.stakingAddress, Config.stakingAbi, this._provider);
    this._stakingContratc = stakingContract;
  }

  public static get provider() {
    return this._provider;
  }

  public static get tokenContract() {
    return this._tokenContract;
  }

  public static get stakingContract() {
    return this._stakingContratc;
  }
}