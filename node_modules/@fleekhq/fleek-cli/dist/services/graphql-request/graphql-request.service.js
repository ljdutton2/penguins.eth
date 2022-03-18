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
const node_fetch_1 = __importDefault(require("node-fetch"));
const environment_service_1 = require("../environment/environment.service");
let GraphQLRequestService = class GraphQLRequestService {
    // eslint-disable-next-line no-useless-constructor
    constructor(environmentService // eslint-disable-next-line no-empty-function
    ) {
        this.environmentService = environmentService;
    }
    query(query, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = yield this.environmentService.getCurrentAppsyncUrl();
            const headers = {
                Accept: 'application/json',
                Authorization: accessToken,
                'Content-Type': 'application/json',
            };
            const result = yield node_fetch_1.default(apiUrl, {
                method: 'POST',
                body: JSON.stringify({ query }),
                headers,
            });
            const body = yield result.text();
            return JSON.parse(body);
        });
    }
};
GraphQLRequestService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(environment_service_1.EnvironmentService)),
    __metadata("design:paramtypes", [environment_service_1.EnvironmentService // eslint-disable-next-line no-empty-function
    ])
], GraphQLRequestService);
exports.GraphQLRequestService = GraphQLRequestService;
exports.default = GraphQLRequestService;
