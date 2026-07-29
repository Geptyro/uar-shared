import type { Component } from 'svelte';

/**
 * UAR's own components. The generic primitives that used to live here —
 * Button, Card, Chip, Tag, Toggle, SectionHeading, HoverPop, and the
 * placeFloating helper — moved to sveltekit-commons; import those from there.
 */

export declare const AccountChip: Component<Record<string, unknown>>;
export declare const BnetButton: Component<Record<string, unknown>>;
export declare const PresenceChip: Component<Record<string, unknown>>;
export declare const PresenceChips: Component<Record<string, unknown>>;
export declare const PresenceGroups: Component<Record<string, unknown>>;
export declare const ReadyChip: Component<Record<string, unknown>>;
export declare const ReadyPlayers: Component<Record<string, unknown>>;
