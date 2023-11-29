import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { useEffect, useState } from 'react';
import Config from '../config';
import axios, { HttpStatusCode } from 'axios';
import { IStakingIndex } from '../types/staking.index';
import { Utils } from '../lib/utils';
import { ethers } from 'ethers';

async function getAllowance(address: `0x${string}`) {
  const result = await axios.get<{ allowance: string }>(`/api/token/${address}/allowance`);

  if (result.status === HttpStatusCode.Ok && result.data) {
    return result.data.allowance;
  }

  return '0';
}


const Home: NextPage = () => {
  const loading = 'loading ...';


  function refetchAllowance() {
    if (address === undefined) {
      return;
    }

    axios.get<{ allowance: string }>(`/api/token/${address}/allowance`).then(result => {
      if (result.status === HttpStatusCode.Ok && result.data) {
        const data = result.data;

        const allowance = Utils.formatTokenAmount(BigInt(data.allowance));
        setAllowance(allowance + ' ' + Config.tokenMeta.symbol);
      }
    });
  }

  function refetchBalance() {
    if (address === undefined) {
      return;
    }

    axios.get<{ balance: string }>(`/api/token/${address}/balance`).then(result => {
      if (result.status === HttpStatusCode.Ok && result.data) {
        const data = result.data;

        const balance = Utils.formatTokenAmount(BigInt(data.balance));
        setBalance(balance + ' ' + Config.tokenMeta.symbol);
      }
    });
  }

  function refetchStakingIndex() {
    if (address === undefined) {
      return;
    }

    axios.get<IStakingIndex>(`/api/staking/${address}`).then(result => {
      if (result.status === HttpStatusCode.Ok && result.data) {
        const data = result.data;

        const balance = Utils.formatTokenAmount(BigInt(data.amount));
        setStakingAmount(balance + ' ' + Config.tokenMeta.symbol);

        const plan = Config.stakingPlans.find(val => val.index === data.plan);
        if (plan !== undefined && data.amount !== '0') {
          setStakingPlan(plan.title);
        } else {
          setStakingPlan('No Active Staking')
        }

        if (data.elapsed === 0) {
          setStakingElapsed('0');
        } else if (data.elapsed <= 60) {
          setStakingElapsed(data.elapsed + ' Seconds');
        } else {
          setStakingElapsed(data.elapsed + ' Minutes');
        }
      }
    });
  }

  const { isConnected, address } = useAccount();

  const [balance, setBalance] = useState(loading);
  const [stakingAmount, setStakingAmount] = useState(loading);
  const [stakingPlan, setStakingPlan] = useState(loading);
  const [stakingElapsed, setStakingElapsed] = useState(loading);

  const [stakeRequestAmount, setStakeRequestAmount] = useState('0');
  const [stakeRequestPlan, setStakeRequestPlan] = useState('0');

  const [allowance, setAllowance] = useState(loading);
  const [allowanceRequestAmount, setAllowanceRequestAmount] = useState('0');

  const { writeAsync: increaseAllowance } = useContractWrite({
    abi: Config.tokenAbi,
    address: Config.tokenAddress,
    functionName: 'increaseAllowance',
  })

  const { writeAsync: stake } = useContractWrite({
    abi: Config.stakingAbi,
    address: Config.stakingAddress,
    account: address,
    functionName: 'stake'
  });

  const { writeAsync: unstake } = useContractWrite({
    abi: Config.stakingAbi,
    address: Config.stakingAddress,
    account: address,
    functionName: 'unstake'
  });

  useEffect(() => {
    if (!isConnected || !address) {
      return;
    };

    refetchAllowance();
    refetchBalance();
    refetchStakingIndex();

  }), [isConnected, address];


  return (
    <div className={styles.container}>
      <Head>
        <title>Staking Platform :: Technical Review</title>
        <meta
          content="This is a simple frontend for staking platform contract"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Welcome to&nbsp;
          <a target='_blank'
            href={"https://goerli.etherscan.io/address/" + Config.tokenAddress}>
            Aria
          </a>&nbsp;
          staking platform
        </h1>
        <p className={styles.description}>
          A place where you can stake some Aria!
        </p>

        {isConnected &&
          <>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h2>Current Balance</h2>
                <p className={styles.center}>{balance}</p>
                <div className={styles.flexcolcenter}>
                  <button className={styles.submit} onClick={async () => {
                    refetchBalance();
                  }}>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.card} style={{ maxWidth: '700px' }}>
                <h2 style={{ textAlign: 'center' }}>Staking Index</h2>
                <div className={styles.flexrow}>
                  <div className={styles.flexcolcenter}>
                    <h2>Amount</h2>
                    <p className={styles.center}>{stakingAmount}</p>
                  </div>
                  <div className={styles.flexcolcenter}>
                    <h2>Plan</h2>
                    <p className={styles.center}>{stakingPlan}</p>
                  </div>
                  <div className={styles.flexcolcenter}>
                    <h2>Time Remained</h2>
                    <p className={styles.center}>{stakingElapsed}</p>
                  </div>
                </div>
                <div className={styles.flexcolcenter}>
                  <button className={styles.submit} onClick={async () => {
                    refetchStakingIndex();
                  }}>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h2>Allowance Amount</h2>
                <p className={styles.center}>{allowance}</p>
                <div className={styles.flexcolcenter}>
                  <button className={styles.submit} onClick={async () => {
                    refetchAllowance();
                  }}>
                    Refresh
                  </button>
                </div>
              </div>
              <div className={styles.card}>
                <h2>Increase Allowance</h2>
                <div className={styles.flexcol}>
                  <input type='number'
                    className={styles.input}
                    placeholder='Amount'
                    onChange={(evt) => {
                      setAllowanceRequestAmount(evt.target.value);
                    }} />
                  <button className={styles.submit} onClick={async () => {
                    await increaseAllowance({
                      args: [Config.stakingAddress, ethers.parseUnits(allowanceRequestAmount, Config.tokenMeta.decimals)]
                    });
                  }}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h2>Stake</h2>
                <div className={styles.flexcol}>
                  <select style={{ marginBottom: '10px' }} onChange={(evt) => {
                    setStakeRequestPlan(evt.target.value);
                  }}>
                    <option value={0}>Select a plan</option>
                    {Config.stakingPlans.map(plan => (
                      <option key={plan.index} value={plan.index}>
                        {plan.title}
                      </option>
                    ))}
                  </select>
                  <input type='number'
                    className={styles.input}
                    placeholder='Amount'
                    onChange={(evt) => {
                      setStakeRequestAmount(evt.target.value);
                    }} />
                  <button className={styles.submit} onClick={async () => {
                    if (stakeRequestPlan === '0' || parseFloat(stakeRequestAmount) === 0) {
                      return;
                    }

                    await stake({
                      args: [ethers.parseUnits(stakeRequestAmount, Config.tokenMeta.decimals), stakeRequestPlan]
                    })
                  }}>
                    Submit
                  </button>
                </div>
              </div>
              <div className={styles.card}>
                <h2>Unstake</h2>
                <div className={styles.flexcol}>
                  <button className={styles.submit} onClick={async () => {
                    await unstake();
                  }}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </>
        }
        {!isConnected &&
          <>
            <p className={styles.warning}>
              Get started by connecting your wallet.
            </p>
          </>
        }
      </main>

      <footer className={styles.footer}>
        * Aria is a mock ERC20 token developed for testing purposes only.
      </footer>
    </div>
  );
};

export default Home;