import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Config from "../../../../config";
import { Utils } from "../../../../lib/utils";
import { IStakingIndex } from "../../../../types/staking.index";
import { ChainSdk } from "../../../../lib/provider";

import abi from '../../../../lib/abi/token.staking.json';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address =  req.query.address as `0x{string}`;

  const amount = (await getMyStakedAmount(address));
  const plan = await getMyStakingPlan(address);
  const elapsed = await getMyStakingRemainingTime(address);

  try {
  
    const index : IStakingIndex = {
      amount: amount.toString(),
      plan,
      elapsed
    };
    res.status(HttpStatusCode.Ok).send(index);

  } catch {
    res.status(HttpStatusCode.BadRequest);
  }
  
  res.end();
}

async function getMyStakedAmount(address: `0x{string}`): Promise<bigint> {
  try {
    const result = await ChainSdk.stakingContract.getMyStakedAmount({from: address});

    return Utils.toBigInt(result);
  } catch (err) {
    console.error(err);

    return BigInt(0);
  }
}

async function getMyStakingPlan(address: `0x{string}`): Promise<number> {
  try {
    const result = await ChainSdk.stakingContract.getMyStakingPlan({from: address});

    const plan = Utils.toBigInt(result);
    return parseInt(plan.toString());
  } catch {
    return 0;
  }
}

async function getMyStakingRemainingTime(address: `0x{string}`): Promise<number> {
  try {
    const result = await ChainSdk.stakingContract.getMyStakingRemainingTime({from:address})

    const plan = Utils.toBigInt(result);
    return parseInt(plan.toString());
  } catch {
    return 0;
  }
}