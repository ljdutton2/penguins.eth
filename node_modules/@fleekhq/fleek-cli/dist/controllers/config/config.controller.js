"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const database_service_1 = require("../../services/database/database.service");
let ConfigController = class ConfigController {
    // eslint-disable-next-line no-useless-constructor
    constructor(databaseService // eslint-disable-next-line no-empty-function
    ) {
        this.databaseService = databaseService;
    }
    /**
     * Returns the config from the db
     */
    showConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const environment = this.databaseService.get('environment');
            const session = this.databaseService.get('session');
            if (!session) {
                return {
                    loggedIn: false,
                    environment,
                };
            }
            return {
                environment,
                loggedIn: true,
                username: session.username,
            };
        });
    }
    /**
     * Updates the environment config
     * @param environment The environment
     */
    updateEnvironmentConfig(environment) {
        this.databaseService.set('environment', environment);
    }
};
ConfigController = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(database_service_1.DatabaseService)),
    __metadata("design:paramtypes", [database_service_1.DatabaseService // eslint-disable-next-line no-empty-function
    ])
], ConfigController);
exports.ConfigController = ConfigController;
exports.default = ConfigController;
