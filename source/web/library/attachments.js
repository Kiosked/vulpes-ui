import joinURL from "url-join";
import axios from "axios";
import ChannelQueue from "@buttercup/channel-queue";
import timeLimit from "time-limit-promise";

const API_BASE = window.vulpesAPIBase;
const MIME_TEXT = /^text\//;
const TIME_LIMIT = 10000;

const __requests = new ChannelQueue();

export function clearDownloadQueue() {
    __requests.channel("get:artifact").clear();
}

export function downloadAttachmentToDataURI(artifactID, mime) {
    return __requests
        .channel("get:artifact")
        .enqueue(
            () =>
                timeLimit(
                    axios
                        .get(
                            joinURL(
                                API_BASE,
                                `/artifact/${artifactID}?mime=${encodeURIComponent(mime)}`
                            ),
                            {
                                responseType: MIME_TEXT.test(mime) ? "text" : "arraybuffer",
                                timeout: TIME_LIMIT
                            }
                        )
                        .then(resp => resp.data),
                    TIME_LIMIT,
                    { rejectWith: new Error("Timed-out fetching artifact") }
                ),
            undefined,
            /* stack: */ `artifact:${artifactID}`
        )
        .then(data =>
            MIME_TEXT.test(mime)
                ? `data:${mime};base64,${btoa(data)}`
                : `data:${mime};base64,${Buffer.from(data).toString("base64")}`
        );
}
