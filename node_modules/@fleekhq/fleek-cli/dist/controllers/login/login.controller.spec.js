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
const authentication_service_1 = require("../../services/authentication/authentication.service");
const authentication_service_mock_1 = require("../../services/authentication/mocks/authentication.service.mock");
const login_controller_1 = require("./login.controller");
describe('LoginController', () => {
    // set mocks for its injectable services
    container_1.default.unbind(authentication_service_1.AuthenticationService);
    container_1.default.bind(authentication_service_1.AuthenticationService).to(authentication_service_mock_1.MockAuthenticationService);
    const loginController = container_1.default.get(login_controller_1.LoginController);
    let mockAuthenticationService;
    beforeEach(() => {
        const authenticationService = container_1.default.get(authentication_service_1.AuthenticationService);
        // as i have to edit some of the responses on the fly but dont
        // want to kill the protection every each we get the database
        // class back to how it should be
        // @ts-ignore
        loginController.authenticationService = authenticationService;
        mockAuthenticationService = authenticationService;
    });
    it('should login the user', () => __awaiter(void 0, void 0, void 0, function* () {
        const spy = spyOn(mockAuthenticationService, 'loginThroughBrowser').and.callThrough();
        yield loginController.login();
        expect(spy).toHaveBeenCalledTimes(1);
    }));
});
