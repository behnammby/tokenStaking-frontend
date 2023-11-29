import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ChainSdk } from "../../../../lib/provider";
import Config from "../../../../config";
import { Utils } from "../../../../lib/utils";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address =  req.query.address as `0x{string}`;

  try {
    const allowance = await getTokenAllowance(address);
  
  const index = {
    allowance: allowance.toString()
  };

  res.status(HttpStatusCode.Ok).send(index);

  } catch {
    res.status(HttpStatusCode.BadRequest);
  }
  
  res.end();
}

async function getTokenAllowance(address: `0x{string}`): Promise<bigint> {
  try {
      const result = await ChainSdk.tokenContract.allowance(address, Config.stakingAddress);

    return Utils.toBigInt(result);
  } catch (err) {
    console.error(err);

    return BigInt(0);
  }
}