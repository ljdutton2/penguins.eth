"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
class Errors {
    /**
     * Runtime error which logs the error out
     * @param error The error message
     * @param logger The logger instance
     * @param objects The objects to log for further details
     */
    static runtimeErrorAndLog(error, ...objects) {
        logger_1.Logger.error(error, objects);
        return new Error(error);
    }
    /**
     * Runtime error
     * @param error The error
     */
    static runtimeError(error) {
        return new Error(error);
    }
}
exports.Errors = Errors;
exports.default = Errors;
