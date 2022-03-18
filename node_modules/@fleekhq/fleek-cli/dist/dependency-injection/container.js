"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const config_controller_1 = require("../controllers/config/config.controller");
const login_controller_1 = require("../controllers/login/login.controller");
const api_service_1 = require("../services/api/api.service");
const authentication_service_1 = require("../services/authentication/authentication.service");
const database_service_1 = require("../services/database/database.service");
const environment_service_1 = require("../services/environment/environment.service");
const graphql_request_service_1 = require("../services/graphql-request/graphql-request.service");
const site_controller_1 = require("../controllers/site/site.controller");
const ipfs_service_1 = require("../services/ipfs/ipfs.service");
const DIContainer = new inversify_1.Container();
DIContainer.bind(database_service_1.DatabaseService)
    .toSelf()
    .inSingletonScope();
DIContainer.bind(environment_service_1.EnvironmentService)
    .toSelf()
    .inSingletonScope();
DIContainer.bind(authentication_service_1.AuthenticationService)
    .toSelf()
    .inSingletonScope();
DIContainer.bind(config_controller_1.ConfigController)
    .toSelf()
    .inSingletonScope();
DIContainer.bind(login_controller_1.LoginController)
    .toSelf()
    .inSingletonScope();
DIContainer.bind(api_service_1.ApiService)
    .toSelf()
    .inSingletonScope();
DIContainer.bind(graphql_request_service_1.GraphQLRequestService)
    .toSelf()
    .inSingletonScope();
DIContainer.bind(site_controller_1.SiteController)
    .toSelf()
    .inSingletonScope();
DIContainer.bind(ipfs_service_1.IpfsService)
    .toSelf()
    .inSingletonScope();
exports.default = DIContainer;
