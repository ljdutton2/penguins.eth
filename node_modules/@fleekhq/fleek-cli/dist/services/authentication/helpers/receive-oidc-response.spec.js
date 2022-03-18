"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const receive_oidc_response_1 = require("./receive-oidc-response");
const login_response_mock_1 = require("../mocks/login-response.mock");
const body = Object.keys(login_response_mock_1.mockToken).reduce((prev, curr) => `${curr}=${login_response_mock_1.mockToken[curr]}&${prev}`, '');
describe('handleResponseEnd', () => {
    let mockRes;
    let mockOnSuccess;
    let mockOnEnd;
    beforeEach(() => {
        mockRes = {
            write: jest.fn(),
            writeHead: jest.fn()
        };
        mockOnSuccess = jest.fn(() => Promise.resolve());
        mockOnEnd = jest.fn();
    });
    it('fails if the nonce does not match', () => {
        const wrongNonce = `${login_response_mock_1.mockToken.state}00`;
        let error;
        try {
            receive_oidc_response_1.handleResponseEnd(body, wrongNonce, mockRes, mockOnSuccess, mockOnEnd);
        }
        catch (e) {
            error = e;
        }
        expect(error.message).toEqual('Unexpected error while processing login flow');
    });
    it('succeeds if nonce does match', () => {
        receive_oidc_response_1.handleResponseEnd(body, login_response_mock_1.mockToken.state, mockRes, mockOnSuccess, mockOnEnd);
        expect(mockRes.writeHead).toHaveBeenCalledTimes(1);
        expect(mockRes.write).toHaveBeenCalledTimes(1);
        expect(mockOnSuccess).toHaveBeenCalledWith(login_response_mock_1.mockToken);
        // Just to throw it into the event loop
        setTimeout(() => {
            expect(mockOnEnd).toHaveBeenCalledTimes(1);
        }, 0);
    });
});
