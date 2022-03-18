"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_utils_1 = require("web3-utils");
const crypto_1 = require("crypto");
const cp = require("child_process");
const os = require("os");
const yargs = require("yargs");
class Utils {
    /**
     * This will get all the program arguments
     */
    static getProgramArguments() {
        const _a = yargs.argv, [command, ...subcommands] = _a._, options = __rest(_a, ["_"]);
        return {
            command,
            options: Object.keys(options).reduce((r, v) => {
                const ret = Object.assign({}, r);
                if (this.ALIASES[v]) {
                    ret[this.ALIASES[v]] = options[v];
                }
                else {
                    ret[v] = options[v];
                }
                return ret;
            }, {}),
            subcommands,
        };
    }
    /**
     * Check if a value is a hex
     * @param hex The hex string
     */
    static isHex(hex) {
        return web3_utils_1.isHexStrict(hex);
    }
    /**
     * To hex string
     * @param value The value
     */
    // tslint:disable-next-line:no-any
    static toHex(value) {
        return web3_utils_1.toHex(value);
    }
    /**
     * Bytes to hex
     * @param bytes The bytes
     */
    static bytesToHex(bytes) {
        const hex = web3_utils_1.bytesToHex(Array.from(bytes));
        return this.padLeft(hex, bytes.length * 2);
    }
    /**
     * Adding padding to the hex
     * @param hex The hex string
     * @param charAmount The char amount
     */
    static padLeft(hex, charAmount) {
        return web3_utils_1.padLeft(hex, charAmount);
    }
    /**
     * Hex to bytes
     * @param hex The hex string
     */
    static hexToBytes(hex) {
        const bytes = web3_utils_1.hexToBytes(hex);
        return Uint8Array.of(...bytes);
    }
    /**
     * Checks to see if its a uint8array
     * @param array The array
     */
    static isUint8Array(array) {
        return array.constructor === Uint8Array;
    }
    /**
     * Check if bytes are equal
     * @param array1 The uint8array 1
     * @param array2 the uint8array 2
     */ static isBytesEqual(array1, array2) {
        if (array1.byteLength !== array2.byteLength) {
            return false;
        }
        for (let i = 0; i !== array1.byteLength; i += 1) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Converts a ethereum address to a checksum address
     * @param address The string ethereum address
     */
    static toChecksumAddress(address) {
        return web3_utils_1.toChecksumAddress(address);
    }
    /**
     * Deep clone a object
     * @param object The object
     */
    static deepClone(object) {
        return JSON.parse(JSON.stringify(object));
    }
    /**
     * Splits the array to string
     * @param value The value
     * @param seperator The seperator
     */
    static splitArrayToString(value, seperator) {
        if (!value) {
            return [];
        }
        return value.toString().split(seperator);
    }
    /**
     * Checks if a given string is a valid Ethereum address.
     * It will also check the checksum, if the address has upper and lowercase letters.
     * @param address The ethereum address
     */
    static isAddress(address) {
        return web3_utils_1.isAddress(address);
    }
    /**
     * Is string invalid
     * @param value The value
     * @param minLength The min length
     */
    static isStringInvalid(value, minLength = 1) {
        return !value || typeof value !== 'string' || value.length < minLength;
    }
    /**
     * Generates a random string
     * @param size The length of the string
     * @param base The alphabet to use
     */
    static generateRandomString(size, base = 'hex') {
        return crypto_1.randomBytes(size)
            .toString(base)
            .slice(0, size);
    }
    /**
     * Return the host name of this system.
     */
    static computerName() {
        switch (process.platform) {
            case 'win32':
                return process.env.COMPUTERNAME;
            case 'darwin':
                return cp
                    .execSync('scutil --get ComputerName')
                    .toString()
                    .trim();
            default:
                return os.hostname();
        }
    }
}
exports.Utils = Utils;
Utils.ALIASES = {
    V: 'version',
    h: 'help',
    u: 'username',
};
exports.default = Utils;
