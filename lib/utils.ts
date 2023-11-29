import { formatUnits } from "viem";
import Config from "../config";

export class Utils {
  public static toBigInt(value: unknown): bigint {
    if (typeof value === 'bigint') {
      return value;
    } else {
      return BigInt(0);
    }
  }

  public static formatTokenAmount(value: bigint): string {
    const formatted = formatUnits(value, Config.tokenMeta.decimals);
    return parseFloat(formatted).toLocaleString();
  }
}