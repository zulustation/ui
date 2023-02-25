import { PalletBalancesAccountData } from "@polkadot/types/lookup";
import { useQueries } from "@tanstack/react-query";
import { Context, isRpcSdk, PoolList } from "@zeitgeistpm/sdk-next";
import { getApiAtBlock } from "lib/util/get-api-at";
import { useSdkv2 } from "../useSdkv2";
import { usePoolAccountIds } from "./usePoolAccountIds";

export const rootKey = "pool-zul-balance";

/**
 * Account balance index for pr pool.
 */
export type PoolZulBalanceLookup = {
  [poolId: number]: PalletBalancesAccountData;
};

/**
 * Fetch pool ZUL balances for a list of pools.
 *
 * @param pools PoolList<Context>
 * @returns PoolZulBalanceLookup
 */
export const usePoolZulBalance = (
  pools?: PoolList<Context>,
  blockNumber?: number,
  opts?: {
    enabled?: boolean;
  },
): PoolZulBalanceLookup => {
  const [sdk, id] = useSdkv2();

  const poolAccountIds = usePoolAccountIds(pools);

  const query = useQueries({
    queries:
      pools?.map((pool) => {
        const accountId = poolAccountIds[pool.poolId];
        return {
          queryKey: [id, rootKey, pool.poolId, blockNumber],
          queryFn: async () => {
            if (sdk && isRpcSdk(sdk) && pools && accountId) {
              const api = await getApiAtBlock(sdk.api, blockNumber);
              return {
                pool,
                balance: await api.query.system.account(accountId),
              };
            }
            return null;
          },
          keepPreviousData: true,
          enabled:
            Boolean(sdk) &&
            isRpcSdk(sdk) &&
            Boolean(accountId) &&
            (typeof opts?.enabled === "undefined" ? true : opts?.enabled),
        };
      }) ?? [],
  });

  return query.reduce<PoolZulBalanceLookup>((index, query) => {
    if (!query.data) return index;
    return {
      ...index,
      [query.data.pool.poolId]: query.data.balance.data,
    };
  }, {});
};
