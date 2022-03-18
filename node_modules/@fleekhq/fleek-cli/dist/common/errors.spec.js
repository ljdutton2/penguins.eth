"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const logger_1 = require("./logger");
describe('Errors', () => {
    describe('runtimeErrorWithLogger', () => {
        it('should return a error object and call `Logger.error`', () => {
            const spy = spyOn(logger_1.Logger, 'error').and.callThrough();
            expect(errors_1.Errors.runtimeErrorAndLog('test')).toBeInstanceOf(Error);
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should match the error message', () => {
            expect(errors_1.Errors.runtimeErrorAndLog('test').message).toEqual('test');
        });
    });
    describe('runtimeError', () => {
        it('should return a error object', () => {
            expect(errors_1.Errors.runtimeError('test')).toBeInstanceOf(Error);
        });
        it('should match the error message', () => {
            expect(errors_1.Errors.runtimeError('test').message).toEqual('test');
        });
    });
});
