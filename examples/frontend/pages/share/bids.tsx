// @ts-nocheck
/** @jsxImportSource theme-ui */

import { useState } from 'react'
import { Spinner } from 'theme-ui'
import { utils } from 'near-api-js'
import { BiddersBids } from '@cura/components'
import Layout from '../../containers/Layout'
import { useRecoilValue } from 'recoil'
import { accountState } from 'state/account'
import { omit } from 'ramda'
import {
    useNFTContract,
    useNearHooksContainer,
    useMarketMethod,
} from '@cura/hooks'

const CONTRACT_REMOVE_BID_GAS = utils.format.parseNearAmount('0.00000000020') // 200 Tgas

const Bids = () => {
    const { contract } = useNFTContract()

    const { accountId } = useNearHooksContainer()

    const [removeBidLoader, setRemoveBidLoader] = useState(false)

    const { data: biddersBids, mutate: mutateBiddersBids } = useMarketMethod(
        'market.share.ysn-1_0_0.ysn.testnet',
        'get_bidders_bids',
        {
            account_id: accountId,
        }
    )

    console.log(biddersBids)

    async function removeBid(token_id: string, bidder: string) {
        setRemoveBidLoader(true)

        try {
            await contract.remove_bid(
                { token_id: token_id, bidder: bidder },
                CONTRACT_REMOVE_BID_GAS
            )

            mutateBiddersBids(omit(token_id, biddersBids))

            setTimeout(() => {
                setRemoveBidLoader(false)
            }, 200)
        } catch (e) {
            console.log(e)
            setRemoveBidLoader(false)
        }
    }

    return (
        <Layout>
            <div
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 3,
                }}
            >
                {removeBidLoader && (
                    <div
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                        }}
                    >
                        <Spinner />
                    </div>
                )}
                {!removeBidLoader && (
                    <BiddersBids
                        biddersBids={biddersBids}
                        onRemoveBid={removeBid}
                    />
                )}
            </div>
        </Layout>
    )
}

export default Bids
