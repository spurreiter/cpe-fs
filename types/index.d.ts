/**
 * @typedef {object} CpeAttributes
 * @property {string} [part]
 * @property {string} [vendor]
 * @property {string} [product]
 * @property {string} [version]
 * @property {string} [update]
 * @property {string} [edition]
 * @property {string} [language]
 * @property {string} [sw_edition]
 * @property {string} [target_sw]
 * @property {string} [target_hw]
 * @property {string} [other]
 */
/** part == Application */
export const PART_APP: "a";
/** part == Operating System */
export const PART_OS: "o";
/** part == Hardware */
export const PART_HW: "h";
export class Cpe {
    /**
     * @param {CpeAttributes} [attrs]
     */
    constructor(attrs?: CpeAttributes | undefined);
    part: string;
    vendor: string;
    product: string;
    version: string;
    update: string;
    edition: string;
    language: string;
    swEdition: string;
    targetSw: string;
    targetHw: string;
    other: string;
    /**
     * @param {string} str
     * @returns {this}
     */
    parse(str?: string): this;
    /**
     * constructs only CPE as formatted string
     * @returns {string} cpe23
     */
    toString(): string;
}
export function bind(inp: any): string;
export function unbind(inp: any): string;
export type CpeAttributes = {
    part?: string | undefined;
    vendor?: string | undefined;
    product?: string | undefined;
    version?: string | undefined;
    update?: string | undefined;
    edition?: string | undefined;
    language?: string | undefined;
    sw_edition?: string | undefined;
    target_sw?: string | undefined;
    target_hw?: string | undefined;
    other?: string | undefined;
};
