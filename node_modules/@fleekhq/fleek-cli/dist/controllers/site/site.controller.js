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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var SiteController_1;
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const inversify_1 = require("inversify");
const path = __importStar(require("path"));
const project_1 = require("../../common/project");
const api_service_1 = require("../../services/api/api.service");
// import { AuthenticationService } from '../../services/authentication/authentication.service';
// import { DatabaseService } from '../../services/database/database.service';
const logger_1 = require("../../common/logger");
const ipfs_service_1 = require("../../services/ipfs/ipfs.service");
const environment_service_1 = require("../../services/environment/environment.service");
const CREATE_NEW_SITE_VALUE = '#!~CREATE_NEW_SITE~#!';
// eslint-disable-next-line
inquirer_1.default.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));
// eslint-disable-next-line
inquirer_1.default.registerPrompt('suggest', require('inquirer-prompt-suggest'));
// Exclude paths in path selection prompts
function excludePath(p) {
    // Hide hidden directories, such as `.git`
    const isHidden = p.length > 1 && p[0] === '.';
    // Hide node_modules
    const isNodeModules = p.includes('node_modules/') || p.endsWith('node_modules');
    return isHidden || isNodeModules;
}
const whenCreatingNewSite = (answer) => answer.siteId === CREATE_NEW_SITE_VALUE;
let SiteController = SiteController_1 = class SiteController {
    constructor(apiService, 
    // @inject(AuthenticationService)
    // private authenticationService: AuthenticationService,
    // @inject(DatabaseService)
    // private databaseService: DatabaseService,
    ipfsService, environmentService) {
        this.apiService = apiService;
        this.ipfsService = ipfsService;
        this.environmentService = environmentService;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure the user has logged in.
            // await this.authenticationService.whoAmI();
            const configuration = yield project_1.ProjectUtils.loadConfiguration();
            if (!('notFound' in configuration)) {
                throw new Error('Cannot initialize the project. Already in a Fleek workspace.');
            }
            const cwd = process.cwd();
            const githubRepo = yield project_1.ProjectUtils.getGithubRepository();
            const settingsFlow = [];
            const isLocalProject = true; // !githubRepo;
            if (githubRepo) {
                // settingsFlow.push(...SiteController.getGithubQuestions());
            }
            const answers = yield inquirer_1.default.prompt([
                {
                    type: 'input',
                    message: 'Which team you wanna use? Please input the teamId.',
                    name: 'teamId',
                },
                {
                    type: 'list',
                    message: 'Which site you wanna use?',
                    name: 'siteId',
                    choices: ({ teamId }) => __awaiter(this, void 0, void 0, function* () {
                        logger_1.Logger.log(`...fetching list of sites for team: ${teamId}`);
                        const sites = yield this.apiService.getSitesByTeam(teamId);
                        return [
                            { name: 'Create new site', value: CREATE_NEW_SITE_VALUE },
                            ...sites.map(site => ({
                                name: site.name,
                                value: site.id,
                            })),
                        ];
                    }),
                },
                // If we're in a githu
                ...(isLocalProject
                    ? []
                    : [
                        {
                            type: 'fuzzypath',
                            excludePath,
                            name: 'baseDir',
                            itemType: 'directory',
                            rootPath: cwd,
                            message: 'Select the base directory for the deployment:',
                            default: cwd,
                            suggestOnly: false,
                            depthLimit: 5,
                            when: whenCreatingNewSite,
                            validate: ({ value }) => {
                                const relative = path.relative(cwd, value);
                                if (relative.startsWith('..')) {
                                    return 'The base directory must be inside the cwd.';
                                }
                                return true;
                            },
                        },
                    ]),
                //
                {
                    type: 'fuzzypath',
                    excludePath,
                    name: 'publicDir',
                    itemType: 'directory',
                    rootPath: '.',
                    message: `Select the public directory for deployment ('.' for current directory):`,
                    suggestOnly: false,
                    depthLimit: 5,
                    when: whenCreatingNewSite,
                    validate: ({ value }, { baseDir }) => {
                        const base = baseDir ? path.resolve(cwd, baseDir) : cwd;
                        const publicDir = path.resolve(base, value);
                        const relative = path.relative(cwd, publicDir);
                        if (relative.startsWith('..')) {
                            return 'The public directory must be inside the cwd.';
                        }
                        return true;
                    },
                },
                ...settingsFlow,
            ]);
            let baseDir = answers.baseDir ? path.resolve(cwd, answers.baseDir) : cwd;
            baseDir = path.relative(cwd, baseDir);
            let publicDir = answers.publicDir
                ? path.resolve(cwd, answers.publicDir)
                : cwd;
            publicDir = path.relative(baseDir, publicDir);
            const config = {
                site: {
                    id: answers.siteId,
                    team: answers.teamId,
                    // only ipfs is supported for new sites via cli at the moment
                    // dfinity deploys would be adviced to use dfx
                    platform: 'ipfs',
                    source: 'ipfs',
                },
                build: {
                    baseDir,
                    publicDir,
                    command: answers.buildCommand,
                    rootDir: '',
                },
            };
            if (answers.siteId === CREATE_NEW_SITE_VALUE) {
                if (githubRepo) {
                    // TODO(parsa) Perform github installation.
                }
                const site = yield this.createSite(config, githubRepo);
                config.site.id = site.id;
                config.site.name = site.name;
            }
            else {
                logger_1.Logger.log('...loading selected sites configuration');
                yield this.updateConfigWithSiteInfo(answers.teamId, answers.siteId, config);
            }
            yield project_1.ProjectUtils.saveConfiguration(config, cwd);
            logger_1.Logger.log(`Fleek site ${config.site.name} was successfully initialized.`);
        });
    }
    updateConfigWithSiteInfo(teamId, siteId, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield this.apiService.getFullSite(teamId, siteId);
            // eslint-disable-next-line no-param-reassign
            config.site = Object.assign(Object.assign({}, config.site), { name: site.name, platform: site.platform, source: 'cid' in site.deploySettings.source ? 'ipfs' : 'github' });
            // TODO: if source is github, try and confirm current directory is git with same remote to issue warning
            // eslint-disable-next-line no-param-reassign
            config.build = Object.assign(Object.assign({}, config.build), { baseDir: site.buildSettings.baseDirectoryPath || '', publicDir: site.buildSettings.publishDirectoryPath || '', command: site.buildSettings.buildCommand });
        });
    }
    // private static getGithubQuestions(): any[] {
    //   return [
    //     {
    //       type: 'suggest',
    //       name: 'buildCommand',
    //       message: 'Build command:',
    //       when: whenCreatingNewSite,
    //       // TODO(parsa)
    //       suggestions: ['yarn build'],
    //     },
    //     {
    //       type: 'suggest',
    //       name: 'dockerImage',
    //       message: 'Docker image:',
    //       when: whenCreatingNewSite,
    //       // TODO(parsa)
    //       suggestions: ['Image 1', 'Image 2'],
    //       default: () => {
    //         // TODO(parsa) Detect docker image based on build command.
    //         return '';
    //       },
    //     },
    //   ];
    // }
    createSite(config, repo) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = {};
            switch (config.site.source) {
                case 'github':
                    // TODO(perfectmak): Handle github source properly
                    source.githubSource = {
                        url: (repo === null || repo === void 0 ? void 0 : repo.url) || '',
                        branch: '',
                        installationId: '',
                    };
                    break;
                case 'ipfs':
                    source.ipfsSource = {
                        cid: yield this.publishIpfsSourceFiles(config),
                    };
                    break;
                default:
                    // should not happen
                    throw new Error('undefined sites source');
            }
            const buildSettings = SiteController_1.mapBuildSettings(config);
            logger_1.Logger.log('creating new site');
            return this.apiService.createSite(Object.assign({ teamId: config.site.team, platform: config.site.platform, buildSettings }, source));
        });
    }
    static mapBuildSettings(config) {
        return {
            buildCommand: config.build.command,
            baseDirectoryPath: config.build.baseDir,
            publishDirectoryPath: config.build.publicDir,
        };
    }
    publishIpfsSourceFiles(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const publishDir = path.resolve(process.cwd(), config.build.publicDir);
            logger_1.Logger.log(`publishing files in ${publishDir} to IPFS`);
            const cid = yield this.ipfsService.uploadDir(config.site.team, publishDir);
            logger_1.Logger.log(`Site cid is ${cid}`);
            return cid;
        });
    }
    /**
     * Trigger deploying of the current site.
     */
    // eslint-disable-next-line class-methods-use-this
    deploy(commitHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield project_1.ProjectUtils.mustLoadConfigruation();
            switch (config.site.source) {
                case 'github':
                    if (!commitHash) {
                        logger_1.Logger.log('Deploying latest version of site');
                    }
                    // todo(perfectmak): Do some check to ensure local head (or commit hash if provided) exists on remote
                    break;
                case 'ipfs':
                    yield this.apiService.updateDeploySettings(config.site.team, config.site.id, {
                        ipfsSource: {
                            cid: yield this.publishIpfsSourceFiles(config),
                        },
                    });
                    break;
                default:
                // unknown
            }
            const deployment = yield this.apiService.deploySite(config.site.team, config.site.id, commitHash);
            if (!deployment) {
                throw new Error('Fleek failed to trigger deployment. This should be a temporary issue. Try deploying again');
            }
            const deploymentUrl = yield this.getDeploymentUrl(deployment.id, config.site.team, config.site.name || config.site.id);
            logger_1.Logger.log('New deployment has been triggered.');
            logger_1.Logger.log(`View deployment here: ${deploymentUrl}`);
        });
    }
    getDeploymentUrl(deploymentId, teamId, siteName) {
        return __awaiter(this, void 0, void 0, function* () {
            const appUrl = yield this.environmentService.getCurrentAppUrl();
            return `${appUrl}/#/sites/${siteName}/deploys/${deploymentId}?accountId=${teamId}`;
        });
    }
};
SiteController = SiteController_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(api_service_1.ApiService)),
    __param(1, inversify_1.inject(ipfs_service_1.IpfsService)),
    __param(2, inversify_1.inject(environment_service_1.EnvironmentService)),
    __metadata("design:paramtypes", [api_service_1.ApiService,
        ipfs_service_1.IpfsService,
        environment_service_1.EnvironmentService])
], SiteController);
exports.SiteController = SiteController;
exports.default = SiteController;
