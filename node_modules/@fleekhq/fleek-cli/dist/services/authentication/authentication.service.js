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
var AuthenticationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
const inversify_1 = require("inversify");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const get_1 = __importDefault(require("lodash/get"));
const open_1 = __importDefault(require("open"));
const database_service_1 = require("../database/database.service");
const environment_service_1 = require("../environment/environment.service");
const graphql_request_service_1 = require("../graphql-request/graphql-request.service");
const utils_1 = require("../../common/utils");
const receive_oidc_response_1 = __importDefault(require("./helpers/receive-oidc-response"));
const queryString = require("querystring");
let AuthenticationService = AuthenticationService_1 = class AuthenticationService {
    // eslint-disable-next-line no-useless-constructor
    constructor(databaseService, graphqlService, environmentService // eslint-disable-next-line no-empty-function
    ) {
        this.databaseService = databaseService;
        this.graphqlService = graphqlService;
        this.environmentService = environmentService;
    }
    /**
     * Logout
     */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.databaseService.set('session', undefined);
            this.databaseService.set('teams', {});
        });
    }
    loginThroughBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.databaseService.get('session')) {
                throw new Error('You are already logged in. Please log out first.');
            }
            const authUrl = yield this.environmentService.getCurrentEnvAuthUrl();
            const redirectUrl = yield this.environmentService.getCurrentEnvAuthRedirectUrl();
            const nonce = utils_1.Utils.generateRandomString(10);
            const oidcParams = {
                nonce,
                client_id: 'fleek-cli',
                redirect_uri: redirectUrl,
                response_mode: 'form_post',
                response_type: 'token id_token',
                scope: 'openid email profile team_info',
                state: nonce,
            };
            const qs = queryString.stringify(oidcParams);
            return new Promise((resolve, reject) => {
                AuthenticationService_1.openWindow(`${authUrl}/auth?${qs}`);
                let loggedIn = false;
                const timeout = setTimeout(() => {
                    if (!loggedIn) {
                        reject(new Error('Did not complete log in flow in the expected time frame.'));
                    }
                }, 1000 * 60 * 10); // 10 minutes timeout
                const onSuccess = (tokens) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield this.updateApiKeysInDb(tokens);
                        yield this.setupTeams(tokens);
                        clearTimeout(timeout);
                        loggedIn = true;
                        return resolve();
                    }
                    catch (err) {
                        return reject(err);
                    }
                });
                AuthenticationService_1.receiveOidcResponse(onSuccess, nonce);
            });
        });
    }
    /**
     * Returns the current user from the db
     */
    whoAmI() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = this.databaseService.get('session');
            if (!session) {
                throw new Error('Not logged in');
            }
            return session;
        });
    }
    getTeamApiKey(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.FLEEK_API_KEY) {
                return process.env.FLEEK_API_KEY;
            }
            const team = this.databaseService.get('teams')[teamId];
            if (!team) {
                throw new Error('No api key found. Generate a Fleek Hosting api key in the Fleek app and make it available to the Fleek CLI by creating an environment variable named FLEEK_API_KEY with a value corresponding to the generated api key.');
            }
            return team.apiKey;
        });
    }
    /**
     * This updates the authentication token
     * @param tokens The current tokens obtained through the OIDC flow
     */
    updateApiKeysInDb(tokens) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutation = `
      mutation generateKey {
        generateApiKey{
          key
          secret
        }
      }
    `;
            const username = get_1.default(jwt_decode_1.default(tokens.access_token), 'sub');
            const newApiKey = yield this.graphqlService.query(mutation, tokens.access_token);
            if (newApiKey.errors && newApiKey.errors.length > 0) {
                throw new Error('Unexpected error while generating new API Keys');
            }
            const { data: { generateApiKey }, } = newApiKey;
            if (!generateApiKey) {
                throw new Error('Unexpected error while generating new API Keys');
            }
            const { key, secret } = generateApiKey;
            if (key && secret) {
                this.databaseService.set('session', {
                    username,
                    apiKey: key,
                    apiSecret: secret,
                });
            }
        });
    }
    setupTeams(tokens) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberships = (yield this.getMemberships(tokens)).filter(m => m.accessLevel === 'admin');
            const label = `Fleek CLI (${utils_1.Utils.computerName()})`;
            const teams = this.databaseService.get('teams');
            // eslint-disable-next-line no-restricted-syntax
            for (const membership of memberships) {
                if (!teams[membership.teamId]) {
                    // eslint-disable-next-line no-await-in-loop
                    const apiKey = yield this.generateAppApiKey(tokens, label, membership.teamId);
                    teams[membership.teamId] = {
                        apiKey,
                        name: membership.teamName,
                    };
                    this.databaseService.set('teams', teams);
                }
            }
        });
    }
    getMemberships(tokens) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      query memberships {
        getMemberships {
            memberships {
                teamId
                teamName
                accessLevel
            }
        }
      }
    `;
            const response = yield this.graphqlService.query(query, tokens.access_token);
            if (response.errors && response.errors.length > 0) {
                throw new Error('Unexpected error when getting user memberships.');
            }
            return response.data.getMemberships.memberships;
        });
    }
    generateAppApiKey(tokens, label, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      mutation {
        generateAppApiKey(input: {
            label: ${JSON.stringify(label)}
            teamId: ${JSON.stringify(teamId)},
            scopes: [
                {
                    target: "sites",
                    action: "*"
                }
            ]
        }) {
            key
        }
      }
    `;
            const response = yield this.graphqlService.query(query, tokens.access_token);
            if (response.errors && response.errors.length > 0) {
                throw new Error('Unexpected error when getting user memberships.');
            }
            return response.data.generateAppApiKey.key;
        });
    }
    static openWindow(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield open_1.default(url);
        });
    }
    static receiveOidcResponse(onSuccess, nonce) {
        return receive_oidc_response_1.default(onSuccess, nonce);
    }
};
AuthenticationService = AuthenticationService_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(database_service_1.DatabaseService)),
    __param(1, inversify_1.inject(graphql_request_service_1.GraphQLRequestService)),
    __param(2, inversify_1.inject(environment_service_1.EnvironmentService)),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        graphql_request_service_1.GraphQLRequestService,
        environment_service_1.EnvironmentService // eslint-disable-next-line no-empty-function
    ])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
exports.default = AuthenticationService;
