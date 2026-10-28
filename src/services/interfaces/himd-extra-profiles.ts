import { HiMDKBPSToFrameSize } from 'himd-js';

// ATRAC3plus frame sizes (in bytes, per 2048-sample frame at 44.1kHz) for the bitrates
// himd-js does not list. They are the same frame sizes used by the maintained Carta5
// profiles, and are what getKBPS() in himd-js derives the bitrate from.
// Mono and stereo share a frame size for a given bitrate - the channel count is
// carried separately in the codec info (see generateCodecInfo's `channels` argument).
const EXTRA_ATRAC3PLUS_FRAME_SIZES: { [kbps: number]: number } = {
    24: 144,
    96: 560,
    128: 744,
    160: 936,
    320: 1864,
};

for (const [kbps, frameSize] of Object.entries(EXTRA_ATRAC3PLUS_FRAME_SIZES)) {
    HiMDKBPSToFrameSize.atrac3plus[parseInt(kbps)] ??= frameSize;
}

// himd-js derives a track's bitrate from its frame size with a floor(), so some modes
// read back off by one (e.g. 320kbps -> 321, 160 -> 161, 32 -> 33). Snap to the nominal bitrate.
export function normalizeAtrac3plusBitrate(kbps: number): number {
    for (const nominal of Object.keys(HiMDKBPSToFrameSize.atrac3plus).map((k) => parseInt(k))) {
        if (Math.abs(nominal - kbps) <= 1) return nominal;
    }
    return kbps;
}
