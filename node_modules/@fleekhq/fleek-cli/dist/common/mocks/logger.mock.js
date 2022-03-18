"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMock = {
    consoleLog: jest.fn(),
    error: jest.fn(),
    invalidCommand: jest.fn(),
    log: jest.fn(),
    logErrorWithHelp: jest.fn(),
};
