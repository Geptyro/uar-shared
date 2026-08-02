/**
 * Replay ingest constants — the contract between anything that produces an
 * upload and the website endpoint that accepts one. Dependency-free.
 *
 * These lived in two places before: the website's `/api/replays` handler and
 * the companion's `src/core/sniff.ts`, whose comment read "Mirrors MAP_TITLE
 * in the website's upload endpoint". They are correctness-critical — a client
 * filtering on a different string either uploads replays it promised not to,
 * or silently stops uploading anything — so they belong in one file.
 */

/**
 * Map title as it appears inside `replay.details`. Note the lower-case "r"
 * in "reborn": this is the string the map ships with, not the branding the
 * website uses, and matching is exact.
 */
export const MAP_TITLE = 'Undead Assault reborn';

/** Largest replay the endpoint accepts, in bytes. */
export const MAX_UPLOAD_SIZE = 16 * 1024 * 1024;
