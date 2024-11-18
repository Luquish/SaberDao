import { extractErrorMessage } from "@rockooor/sail";
import * as Sentry from "@sentry/react";
import { notify } from "./notifications";
export class CapturedError extends Error {
    name;
    message;
    source;
    originalError;
    constructor(name, message, source, originalError) {
        super(message);
        this.name = name;
        this.message = message;
        this.source = source;
        this.originalError = originalError;
    }
}
export const describeRPCError = (msg) => {
    try {
        const result = JSON.parse(msg.substring("503 : ".length));
        return `${result.error.message} (${result.error.code})`;
    }
    catch (e) {
        // ignore parse error
    }
    return msg;
};
/**
 * Captures an exception.
 */
export const handleException = (err, { name = err instanceof Error ? err.name : "CapturedError", source = name ?? "unspecified", userMessage, groupInSentry, extra, }) => {
    const captured = new CapturedError(name, extractErrorMessage(err) ?? "unknown", source, err);
    console.error(`[${captured.name}] (from ${captured.source})`);
    console.error(captured);
    console.error(captured.originalError);
    if (extra) {
        console.table(Object.entries(extra).map(([k, v]) => ({
            key: k,
            value: v,
        })));
    }
    notify({
        message: userMessage?.title ?? name ?? "Unknown Error",
        description: userMessage?.description ?? captured.message,
        type: "error",
    });
    const sentryArgs = {
        tags: {
            source,
        },
        extra: {
            ...extra,
            originalError: captured.originalError,
            userMessage,
            originalStack: captured.originalError instanceof Error
                ? captured.originalError.stack
                : undefined,
        },
    };
    if (groupInSentry) {
        sentryArgs.fingerprint = [captured.name, source];
    }
    Sentry.captureException(captured, sentryArgs);
};
