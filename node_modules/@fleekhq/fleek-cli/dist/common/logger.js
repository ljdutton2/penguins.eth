"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_progress_1 = require("cli-progress");
const colors = require("colors");
const util = require("util");
const { error: consoleErrorNative, log: consoleLogNative } = console;
class Logger {
    /**
     * Render `console.error` in the terminal
     * @param msg The message
     * @param objects Any additional logs
     */
    static error(msg, ...objects) {
        this.consoleError(colors.red(msg), objects);
    }
    /**
     * Wrapper around `error` will just render `console.error`
     * @param command The invalid command string
     */
    static invalidCommand(command) {
        this.consoleError(`${command} is not a valid command`);
    }
    /**
     * Render `console.log` in the terminal
     * @param msg The message
     * @param objects Any additional logs
     */
    static log(msg, ...objects) {
        this.consoleLog(msg, objects);
    }
    /**
     * Render `console.log` in the terminal
     * @param msg The message
     * @param options Any additional logs
     */
    static logWithColour(msg, options = {
        colors: true,
        depth: null,
        compact: false,
    }) {
        this.log(util.inspect(msg, options));
    }
    /**
     * Wrapper around `console.log` to use its native function
     * @param msg The message
     * @param objects Any additional logs
     */
    static consoleLog(msg, ...objects) {
        if (objects.length > 0 && objects[0].length > 0) {
            consoleLogNative.call(console, msg);
        }
        else {
            consoleLogNative.call(console, msg);
        }
    }
    static progressLogger(maxCount) {
        const bar = new cli_progress_1.SingleBar({ forceRedraw: true }, cli_progress_1.Presets.shades_classic);
        if (maxCount) {
            bar.start(maxCount, 0);
        }
        return bar;
    }
    /**
     * Wrapper around `console.error` to use its native function
     * @param msg The message
     * @param objects Any additional logs
     */
    static consoleError(msg, ...objects) {
        if (objects.length > 0 && objects[0].length > 0) {
            consoleErrorNative.call(console, msg, objects);
        }
        else {
            consoleErrorNative.call(console, msg);
        }
    }
}
exports.Logger = Logger;
exports.default = Logger;
