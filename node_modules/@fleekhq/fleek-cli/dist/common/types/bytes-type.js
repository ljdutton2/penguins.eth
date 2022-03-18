"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const base_type_1 = __importDefault(require("./base-type"));
class BytesType extends base_type_1.default {
    get value() {
        if (!this.internalValue) {
            throw BytesType.valueNotSetError();
        }
        return this.internalValue;
    }
    toHexString() {
        return utils_1.Utils.bytesToHex(this.value);
    }
    validate() {
        if (this.value.length !== this.getRequiredByteLength()) {
            throw errors_1.Errors.runtimeErrorAndLog(`Invalid - Byte length must be ${this.getRequiredByteLength()}, length is ${this.value.length} and value which you tried to put was ${this.value}`, { actualLength: this.value.length });
        }
    }
    setValue(value) {
        if (typeof value === 'string') {
            if (!utils_1.Utils.isHex(value)) {
                throw errors_1.Errors.runtimeErrorAndLog('String supplied is not a hex string', value);
            }
            this.internalValue = utils_1.Utils.hexToBytes(value);
            return;
        }
        if (utils_1.Utils.isUint8Array(value)) {
            this.internalValue = value;
            return;
        }
        throw errors_1.Errors.runtimeErrorAndLog('Value supplied is not a valid hex string or uint8array', value);
    }
    /**
     * Internal equals
     * @param other The other uint8array
     */
    internalEquals(other) {
        if (!this.internalValue) {
            throw errors_1.Errors.runtimeErrorAndLog('Running internal equals when value is undefined is not allowed');
        }
        return utils_1.Utils.isBytesEqual(this.value, other);
    }
}
exports.default = BytesType;
