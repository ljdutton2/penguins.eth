"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_controller_1 = require("../controllers/config/config.controller");
const login_controller_1 = require("../controllers/login/login.controller");
const authentication_service_1 = require("../services/authentication/authentication.service");
const database_service_1 = require("../services/database/database.service");
const container_1 = __importDefault(require("./container"));
describe('DIContainer', () => {
    it('should have `DatabaseService` in the container and be a singleton', () => {
        const instance = container_1.default.get(database_service_1.DatabaseService);
        expect(instance).toBeInstanceOf(database_service_1.DatabaseService);
        // @ts-ignore
        instance.modified = true;
        const instance2 = container_1.default.get(database_service_1.DatabaseService);
        // @ts-ignore
        expect(instance2.modified).toEqual(true);
    });
    it('should have `AuthenticationService` in the container and be a singleton', () => {
        const instance = container_1.default.get(authentication_service_1.AuthenticationService);
        expect(instance).toBeInstanceOf(authentication_service_1.AuthenticationService);
        // @ts-ignore
        instance.modified = true;
        const instance2 = container_1.default.get(authentication_service_1.AuthenticationService);
        // @ts-ignore
        expect(instance2.modified).toEqual(true);
    });
    it('should have `ConfigController` in the container and be a singleton', () => {
        const instance = container_1.default.get(config_controller_1.ConfigController);
        expect(instance).toBeInstanceOf(config_controller_1.ConfigController);
        // @ts-ignore
        instance.modified = true;
        const instance2 = container_1.default.get(config_controller_1.ConfigController);
        // @ts-ignore
        expect(instance2.modified).toEqual(true);
    });
    it('should have `LoginController` in the container and be a singleton', () => {
        const instance = container_1.default.get(login_controller_1.LoginController);
        expect(instance).toBeInstanceOf(login_controller_1.LoginController);
        // @ts-ignore
        instance.modified = true;
        const instance2 = container_1.default.get(login_controller_1.LoginController);
        // @ts-ignore
        expect(instance2.modified).toEqual(true);
    });
});
