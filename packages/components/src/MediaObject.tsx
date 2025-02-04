// @ts-nocheck
/** @jsxImportSource theme-ui */

import { useNFTContentType } from '@cura/hooks'
import { Placeholder } from './Placeholder'

type mediaObjectProps = {
    mediaURI: string
    width?: number | string
    height?: number | string
    loading?: boolean
    autoPlay?: boolean
}

function Text({ width, height, content }) {
    return (
        <pre
            sx={{
                width: width,
                height: height,
            }}
        >
            {content}
        </pre>
    )
}

function Video({ mediaURI, width, height, autoPlay }: mediaObjectProps) {
    return (
        <video
            width={width}
            height={height}
            muted
            autoPlay={autoPlay}
            controls={!autoPlay}
            loop
            playsInline
        >
            <source src={mediaURI} />
        </video>
    )
}

function Audio({ mediaURI }: mediaObjectProps) {
    return <audio controls src={mediaURI}></audio>
}

function Image({ mediaURI, width, height }: mediaObjectProps) {
    return (
        <img
            sx={{
                width: width,
                minHeight: height,
                maxHeight: '70vh',
                objectFit: 'cover',
                bg: 'gray.3',
            }}
            src={mediaURI}
        />
    )
}

function Iframe({ mediaURI, width, height }: mediaObjectProps) {
    return (
        <iframe
            width={width}
            height={height}
            src={mediaURI}
            frameBorder="0"
            scrolling="no"
        ></iframe>
    )
}

export function MediaObject(props: mediaObjectProps) {
    const { loading, data, content } = useNFTContentType(props.mediaURI)

    if (props.loading || loading) {
        return (
            <Placeholder
                width={props.width}
                height={props.height || props.width}
                style={{ my: 0 }}
            />
        )
    }
    switch (data) {
        case 'image':
            return <Image {...props} />

        case 'video':
            return <Video {...props} />

        case 'audio':
            return <Audio {...props} />

        case 'text':
            return <Text {...props} content={content} />

        case 'html' || 'other':
            return <Iframe {...props} />

        default:
            return <></>
    }
}
