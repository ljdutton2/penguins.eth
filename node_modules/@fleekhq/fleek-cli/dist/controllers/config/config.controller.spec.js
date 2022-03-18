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
const database_service_1 = require("../../services/database/database.service");
const environment_type_1 = require("../../services/environment/enums/environment-type");
const config_controller_1 = require("./config.controller");
describe('ConfigController', () => {
    const configController = container_1.default.get(config_controller_1.ConfigController);
    let mockDatabaseService;
    beforeEach(() => {
        const databaseService = container_1.default.get(database_service_1.DatabaseService);
        // as i have to edit some of the responses on the fly but dont
        // want to kill the protection every each we get the database
        // class back to how it should be
        // @ts-ignore
        configController.databaseService = databaseService;
        mockDatabaseService = databaseService;
    });
    describe('showConfig', () => {
        it('should return loggedIn false with environment', () => __awaiter(void 0, void 0, void 0, function* () {
            const spy = spyOn(mockDatabaseService, 'get').and.callThrough();
            const result = yield configController.showConfig();
            expect(result).toEqual({
                environment: environment_type_1.EnvironmentType.prd,
                loggedIn: false,
            });
            expect(spy).toHaveBeenCalledTimes(1);
        }));
        xit('should return logged in true with username and environment (TEST NEEDS TO BE CHANGED)', () => __awaiter(void 0, void 0, void 0, function* () {
            const spy = spyOn(mockDatabaseService, 'get').and.callThrough();
            const result = yield configController.showConfig();
            expect(result).toEqual({
                environment: environment_type_1.EnvironmentType.prd,
                loggedIn: true,
                username: 'test_username',
            });
            expect(spy).toHaveBeenCalledTimes(1);
        }));
    });
});
