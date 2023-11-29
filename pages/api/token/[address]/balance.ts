import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ChainSdk } from "../../../../lib/provider";
import Config from "../../../../config";
import { Utils } from "../../../../lib/utils";
import { ethers } from "ethers";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address =  req.query.address as `0x{string}`;

  try {

    const balance = await getTokenBalance(address);
  
  const index = {
    balance: balance.toString()
  };

  res.status(HttpStatusCode.Ok).send(index);

  } catch {
    res.status(HttpStatusCode.BadRequest);
  }
  
  res.end();
}

async function getTokenBalance(address: `0x{string}`): Promise<bigint> {
  try {
      const result = await ChainSdk.tokenContract.balanceOf(address);

    return Utils.toBigInt(result);
  } catch (err) {
    console.error(err);

    return BigInt(0);
  }
}