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
const database_service_1 = require("../database/database.service");
const environment_type_1 = require("./enums/environment-type");
/**
 * Gets the environment URL if you already know the environment type
 * @param environmentType The environment type
 * @param mapping The environment to value mapping
 */
const getEnvUrlForEnvType = (environmentType, mapping) => {
    if (!Object.keys(environment_type_1.EnvironmentType).includes(environmentType)) {
        throw new Error(`Environment type supplied (${environmentType}) is not a valid environment type we support`);
    }
    return mapping[environmentType];
};
let EnvironmentService = class EnvironmentService {
    // eslint-disable-next-line no-useless-constructor
    constructor(databaseService // eslint-disable-next-line no-empty-function
    ) {
        this.databaseService = databaseService;
        // TODO change URLS when testing auth
        this.environmentToEndpointMappings = {
            dev: 'https://dev.terminal.co/',
            stg: 'https://stg.terminal.co/',
            prd: 'https://terminal.co/',
        };
        this.authEndpointMappings = {
            dev: 'https://dev-auth.fleek.co',
            stg: 'https://stg-auth.fleek.co',
            prd: 'https://auth.fleek.co',
        };
        this.appUrlMappings = {
            dev: 'https://dev-app.fleek.co',
            stg: 'https://stg-app.fleek.co',
            prd: 'https://app.fleek.co',
        };
        this.authRedirectUrlMappings = {
            dev: 'https://dev-cli-login.fleek.co',
            stg: 'https://stg-cli-login.fleek.co',
            prd: 'https://cli-login.fleek.co',
        };
        this.appsyncApiUrlMappings = {
            dev: 'https://7w65cjs2fnbwzdsltmxj427wfu.appsync-api.us-west-2.amazonaws.com/graphql',
            stg: 'https://h6qbvxquqjg5direndhm7ugaj4.appsync-api.us-west-2.amazonaws.com/graphql',
            prd: 'https://b6756lokszgovfg2lkge3t4kai.appsync-api.us-west-2.amazonaws.com/graphql',
        };
        this.publicApiUrlMappings = {
            dev: 'https://dev-api.fleek.co/graphql',
            std: 'https://stg-api.fleek.co/graphql',
            prd: 'https://api.fleek.co/graphql',
        };
        this.fleekIpfsUrlMappings = {
            dev: 'https://ipfsapi-dev.fleek.co',
            stg: 'https://ipfsapi-stg.fleek.co',
            prd: 'https://ipfsapi.fleek.co',
        };
    }
    /**
     * Get the current environment url
     */
    getCurrentEnvironmentUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return getEnvUrlForEnvType(this.databaseService.get('environment') || environment_type_1.EnvironmentType.prd, this.environmentToEndpointMappings);
        });
    }
    /**
     * Get the current auth environment url
     */
    getCurrentEnvAuthUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return getEnvUrlForEnvType(this.databaseService.get('environment') || environment_type_1.EnvironmentType.prd, this.authEndpointMappings);
        });
    }
    /**
     * Get the current redirect_uri environment url for auth
     */
    getCurrentEnvAuthRedirectUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return getEnvUrlForEnvType(this.databaseService.get('environment') || environment_type_1.EnvironmentType.prd, this.authRedirectUrlMappings);
        });
    }
    /**
     * Get the appsync api url
     */
    getCurrentAppsyncUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return getEnvUrlForEnvType(this.databaseService.get('environment') || environment_type_1.EnvironmentType.prd, this.appsyncApiUrlMappings);
        });
    }
    /**
     * Get the current public api url.
     */
    getCurrentApiUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return getEnvUrlForEnvType(this.databaseService.get('environment') || environment_type_1.EnvironmentType.prd, this.publicApiUrlMappings);
        });
    }
    /**
     * Get Fleek Web App Url
     */
    getCurrentAppUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return getEnvUrlForEnvType(this.databaseService.get('environment') || environment_type_1.EnvironmentType.prd, this.appUrlMappings);
        });
    }
    getCurrentIpfsUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return getEnvUrlForEnvType(this.databaseService.get('environment') || environment_type_1.EnvironmentType.prd, this.fleekIpfsUrlMappings);
        });
    }
};
EnvironmentService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(database_service_1.DatabaseService)),
    __metadata("design:paramtypes", [database_service_1.DatabaseService // eslint-disable-next-line no-empty-function
    ])
], EnvironmentService);
exports.EnvironmentService = EnvironmentService;
exports.default = environment_type_1.EnvironmentType;
