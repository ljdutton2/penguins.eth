"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = __importDefault(require("../../dependency-injection/container"));
const database_service_1 = require("../database/database.service");
const environment_service_1 = require("../environment/environment.service");
const environment_service_mock_1 = require("../environment/mocks/environment.service.mock");
const authentication_service_1 = require("./authentication.service");
const graphql_request_service_1 = __importDefault(require("../graphql-request/graphql-request.service"));
const login_response_mock_1 = require("./mocks/login-response.mock");
describe('AuthenticationService ', () => {
    // set mocks for its injectable services
    container_1.default.unbind(environment_service_1.EnvironmentService);
    container_1.default.bind(environment_service_1.EnvironmentService).to(environment_service_mock_1.MockEnvironmentService);
    const authenticationService = container_1.default.get(authentication_service_1.AuthenticationService);
    let mockGraphqlService;
    let mockDatabaseService;
    // let mockEnvironmentService: MockEnvironmentService;
    beforeEach(() => {
        const databaseService = container_1.default.get(database_service_1.DatabaseService);
        const graphqlService = container_1.default.get(graphql_request_service_1.default);
        const environmentService = container_1.default.get(environment_service_1.EnvironmentService);
        // as i have to edit some of the responses on the fly but dont
        // want to kill the protection each time we get the database
        // class back to how it should be
        // @ts-ignore
        authenticationService.databaseService = databaseService;
        // @ts-ignore
        authenticationService.graphqlService = graphqlService;
        // @ts-ignore
        authenticationService.environmentService = environmentService;
        mockDatabaseService = databaseService;
        mockGraphqlService = graphqlService;
        // mockEnvironmentService = environmentService;
        // @ts-ignore
        authentication_service_1.AuthenticationService.openWindow = jest.fn();
    });
    describe('loginThroughBrowser', () => {
        beforeEach(() => {
            // @ts-ignore
            authentication_service_1.AuthenticationService.receiveOidcResponse = jest.fn((onSuccess, nonce) => onSuccess(login_response_mock_1.mockToken));
        });
        it('should throw an error when login fails when generating api keys', () => __awaiter(void 0, void 0, void 0, function* () {
            mockGraphqlService.query = jest.fn().mockImplementation(() => Promise.resolve(login_response_mock_1.generateApiKeyErrorResponse));
            let error;
            try {
                yield authenticationService.loginThroughBrowser();
            }
            catch (e) {
                error = e;
            }
            expect(error.message).toEqual('Unexpected error while generating new API Keys');
        }));
        it('should login successfully and update the token in the db', () => __awaiter(void 0, void 0, void 0, function* () {
            const dbSetDbSpy = spyOn(mockDatabaseService, 'set').and.callThrough();
            mockGraphqlService.query = jest.fn().mockImplementation(() => Promise.resolve(login_response_mock_1.generateApiKeyResponse));
            yield authenticationService.loginThroughBrowser();
            expect(dbSetDbSpy).toHaveBeenCalledTimes(1);
        }));
    });
});
