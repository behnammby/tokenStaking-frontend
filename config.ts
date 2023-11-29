import { ariaAbi, tokenStakingAbi } from './lib/abi';


export default class Config {
  public static readonly  tokenMeta = {
    name: 'Aria',
    symbol: '$ARA',
    decimals: 18
  };

  public static readonly   stakingPlans = [
    { index: 1, rewardPercentage: 1, title: '1 Minute' },
    { index: 2, rewardPercentage: 5, title: '5 Minutes' },
    { index: 3, rewardPercentage: 10, title: '10 Minutes' }
  ];

  public static chainId = 5;

  public static readonly tokenAddress = '0x757fd4B38eAc09b52c8dA663aB8df6dd66eBb0eb';
  public static readonly stakingAddress = '0x8b6a3EB6d8b5b23857d70f8027346F6f76B7d8df';
  public static readonly utilsAddress = '0x7b1075Eb0D2A45C21ea07dbdd1C6Bb7590D7C879';

  public static readonly stakingAbi = tokenStakingAbi;
  public static readonly tokenAbi = ariaAbi;
}