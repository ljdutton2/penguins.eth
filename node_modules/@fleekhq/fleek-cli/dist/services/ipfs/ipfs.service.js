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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
// import ipfsClient from 'ipfs-http-client';
// import globSource from 'ipfs-utils/src/files/glob-source';
const tar_1 = __importDefault(require("tar"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const path_1 = __importDefault(require("path"));
const authentication_service_1 = require("../authentication/authentication.service");
const environment_service_1 = require("../environment/environment.service");
// import { Logger } from '../../common/logger';
let IpfsService = class IpfsService {
    constructor(authenticationService, environmentService) {
        this.authenticationService = authenticationService;
        this.environmentService = environmentService;
    }
    uploadDir(teamId, dirPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = yield this.authenticationService.getTeamApiKey(teamId);
            const ipfsApiUrl = yield this.environmentService.getCurrentIpfsUrl();
            console.log('packaging site contents...');
            const stream = tar_1.default
                .c({
                gzip: true,
                preservePaths: false,
                cwd: path_1.default.dirname(dirPath),
            }, [path_1.default.basename(dirPath)])
                .on('end', () => {
                console.log('uploading...');
            });
            const fd = new form_data_1.default();
            fd.append('file', stream);
            const headers = Object.assign({ 'x-api-key': apiKey }, fd.getHeaders());
            const { ipfsHash } = yield axios_1.default
                .post(`${ipfsApiUrl}/api/fleek/upload`, fd, {
                headers,
                maxBodyLength: 268435456,
            })
                .then(res => {
                return res.data;
            })
                .catch((e) => {
                console.log(e.message);
                return { ipfsHash: null };
            });
            if (!ipfsHash) {
                throw new Error(`uploading to ipfs was not successful. Try again`);
            }
            return ipfsHash;
        });
    }
};
IpfsService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(authentication_service_1.AuthenticationService)),
    __param(1, inversify_1.inject(environment_service_1.EnvironmentService)),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService,
        environment_service_1.EnvironmentService])
], IpfsService);
exports.IpfsService = IpfsService;
exports.default = IpfsService;
