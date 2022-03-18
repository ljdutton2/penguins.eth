"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
class BaseType {
    constructor(value) {
        // set the value
        this.setValue(value);
        // force the validation to always fire straight away on creation of any classes
        // which extend the Base
        this.validate();
    }
    /**
     * Value not set error
     */
    static valueNotSetError() {
        return errors_1.Errors.runtimeErrorAndLog('Value set is undefined');
    }
}
exports.default = BaseType;
