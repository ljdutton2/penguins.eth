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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const graphql_request_1 = require("graphql-request");
const authentication_service_1 = require("../authentication/authentication.service");
const environment_service_1 = require("../environment/environment.service");
const types = __importStar(require("./models"));
/**
 * Expose Fleek APIs.
 */
let ApiService = class ApiService {
    constructor(authenticationService, environmentService) {
        this.authenticationService = authenticationService;
        this.environmentService = environmentService;
    }
    request(gqlRequestBody, teamId, variables) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = yield this.environmentService.getCurrentApiUrl();
            const apiKey = yield this.authenticationService.getTeamApiKey(teamId);
            const client = new graphql_request_1.GraphQLClient(apiUrl, {
                headers: {
                    authorization: apiKey,
                },
            });
            return client.request(gqlRequestBody, variables);
        });
    }
    /**
     * Return the list of sites in a given team.
     * @param teamId Id of the team.
     */
    getSitesByTeam(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = graphql_request_1.gql `
      query GetSitesByTeam($teamId: ID!) {
        getSitesByTeam(teamId: $teamId) {
          sites {
            ${types.SiteFragment}
          }
        }
      }
    `;
            const res = yield this.request(query, teamId, { teamId });
            return res.getSitesByTeam.sites;
        });
    }
    createSite(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = graphql_request_1.gql `
      mutation AddSite($input: AddSiteInput!) {
        addSite(input: $input) {
          ${types.SiteFragment}
        }
      }
    `;
            const res = yield this.request(query, input.teamId, {
                input,
            });
            return res.addSite;
        });
    }
    getFullSite(teamId, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = graphql_request_1.gql `
      query GetSiteById($siteId: ID!) {
        getSiteById(siteId: $siteId) {
          ${types.FullSiteFragment}
        }
      }
    `;
            const res = yield this.request(query, teamId, { siteId });
            return res.getSiteById;
        });
    }
    updateDeploySettings(teamId, siteId, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = graphql_request_1.gql `
      mutation EditDeploySettings($input: EditDeploySettings!) {
        editDeploySettings(input: $input) {
          ${types.SiteFragment}
        }
      }
    `;
            const res = yield this.request(query, teamId, {
                input: Object.assign({ siteId }, settings),
            });
            return res.editDeploySettings;
        });
    }
    deploySite(teamId, siteId, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = graphql_request_1.gql `
      mutation TriggerDeploy($siteId: ID!, $commit: String) {
        triggerDeploy(siteId: $siteId, commit: $commit) {
          ${types.DeployFragment}
        }
      }
    `;
            const res = yield this.request(query, teamId, {
                siteId,
                commit: hash,
            });
            return res.triggerDeploy;
        });
    }
};
ApiService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(authentication_service_1.AuthenticationService)),
    __param(1, inversify_1.inject(environment_service_1.EnvironmentService)),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService,
        environment_service_1.EnvironmentService])
], ApiService);
exports.ApiService = ApiService;
exports.default = ApiService;
