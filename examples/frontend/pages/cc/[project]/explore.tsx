// @ts-nocheck
/** @jsxImportSource theme-ui */

import { useState } from 'react'
import { Button, Divider } from 'theme-ui'
import { utils } from 'near-api-js'
import { useRouter } from 'next/router'
import Layout from '../../../containers/Layout'
import {
    BidCreate,
    Metadata,
    CreatorShare,
    MediaObject,
} from '@cura/components'
import { alertMessageState, indexLoaderState } from '../../../state/recoil'
import { useSetRecoilState } from 'recoil'
import {
    useNFTContract,
    useNFTMethod,
    useNearHooksContainer,
} from '@cura/hooks'
import { mapPathToProject } from 'utils/path-to-project'
import { getFrameWidth } from 'utils/frame-width'

const CONTRACT_RANDOM_GAS = utils.format.parseNearAmount('0.00000000020') // 200 Tgas
const MARKET_SET_BID_GAS = utils.format.parseNearAmount('0.00000000020') // 200 Tgas

const HARDCODED_ROYALTY_ADDRESS = process.env.YSN_ADDRESS
const HARDCODED_ROYALTY_SHARE = '2500'

const Explore = ({}) => {
    const router = useRouter()

    const { contract } = useNFTContract(`${mapPathToProject(router.asPath)}`)

    const project = `cc/${router.query.project}`

    const { accountId } = useNearHooksContainer()

    const setAlertMessage = useSetRecoilState(alertMessageState)
    const setIndexLoader = useSetRecoilState(indexLoaderState)

    const [randomDesign, setRandomDesign] = useState({
        id: '',
        owner_id: '',
        instructions: [],
        metadata: {
            title: '',
        },
    })

    const { data: totalSupply } = useNFTMethod(
        `${mapPathToProject(router.asPath)}`,
        'nft_total_supply',
        {}
    )

    async function setBid(amount, resale) {
        setIndexLoader(true)
        try {
            await contract.set_bid(
                {
                    token_id: randomDesign.id,
                    amount: utils.format.parseNearAmount(amount),
                    bidder: accountId,
                    recipient: randomDesign.owner_id,
                    sell_on_share: parseInt(resale) * 100,
                    currency: 'near',
                },
                MARKET_SET_BID_GAS,
                utils.format.parseNearAmount(amount)
            )
        } catch (e) {
            setIndexLoader(false)
            setAlertMessage(e.toString())
        }
    }

    async function exploreDesign() {
        setIndexLoader(true)

        try {
            const randomDesign = Math.floor(Math.random() * totalSupply)
            const result = await contract.nft_tokens(
                { from_index: randomDesign.toString(), limit: 1 },
                CONTRACT_RANDOM_GAS
            )

            console.log(result)

            setRandomDesign({
                id: result[0]?.id,
                owner_id: result[0]?.owner_id,
                metadata: {
                    title: result[0]?.metadata?.title,
                    media: result[0]?.metadata?.media,
                },
            })

            setTimeout(() => setIndexLoader(false), 200)
        } catch (e) {
            setIndexLoader(false)
            setAlertMessage(e.toString())
        }
    }

    const frameDimension = getFrameWidth()

    return (
        <Layout project={project}>
            <>
                <div
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 3,
                    }}
                >
                    <Button onClick={exploreDesign} variant="orange">
                        Explore
                    </Button>
                </div>
                <div
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    {randomDesign?.metadata?.media && (
                        <MediaObject
                            mediaURI={`https://arweave.net/${randomDesign?.metadata.media}`}
                            width={frameDimension}
                            height={frameDimension}
                        />
                    )}
                </div>
                <div
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Metadata data={randomDesign} loading={false} />
                </div>
                <div
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 3,
                    }}
                >
                    <CreatorShare
                        address={HARDCODED_ROYALTY_ADDRESS}
                        share={HARDCODED_ROYALTY_SHARE}
                    />
                </div>
                <div
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 3,
                        mb: 3,
                    }}
                >
                    <Divider sx={{ width: 300 }} />
                    <BidCreate
                        title={randomDesign?.metadata.title}
                        creator={randomDesign?.owner_id}
                        onBid={setBid}
                    />
                </div>
            </>
        </Layout>
    )
}

export default Explore
