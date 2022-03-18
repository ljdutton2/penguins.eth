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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const execa_1 = __importDefault(require("execa"));
const parse_github_url_1 = __importDefault(require("parse-github-url"));
const memorize_decorator_1 = __importDefault(require("memorize-decorator"));
const find_up_1 = __importDefault(require("find-up"));
const ajv_1 = __importDefault(require("ajv"));
const path_1 = __importDefault(require("path"));
const schema_json_1 = __importDefault(require("../schema.json"));
const errors_1 = require("./errors");
exports.ConfigurationFilename = '.fleek.json';
/**
 * Responsible for working with the project environment.
 */
class ProjectUtils {
    static getGitRemoteUrl(remote = 'origin') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { stdout } = yield execa_1.default('git', ['remote', 'get-url', remote]);
                return stdout || undefined;
            }
            catch (_) {
                return undefined;
            }
        });
    }
    /**
     * Return the github repo of the current directory.
     */
    static getGithubRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield ProjectUtils.getGitRemoteUrl();
            const parsed = url !== undefined ? parse_github_url_1.default(url) : undefined;
            if ((parsed === null || parsed === void 0 ? void 0 : parsed.host) === 'github.com' && parsed.owner && parsed.repo) {
                return {
                    // parsed.repo is in the form: `FleekHQ/fleek-cli`.
                    url: `https://api.github.com/repos/${parsed.repo}`,
                    owner: parsed.owner,
                    repo: parsed.repo,
                };
            }
            return undefined;
        });
    }
    static saveConfiguration(config, dirPath) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.writeFileSync(path_1.default.resolve(dirPath, exports.ConfigurationFilename), JSON.stringify(config, null, 2));
        });
    }
    /**
     * Try to find, parse and validate the nearest .fleek.json file.
     */
    static loadConfiguration() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const src = yield find_up_1.default(exports.ConfigurationFilename);
            if (!src) {
                return {
                    notFound: true,
                };
            }
            // eslint-disable-next-line
            const config = require(src);
            const ajv = new ajv_1.default({
                allErrors: true,
            });
            // Validate the configuration file and collect the errors.
            const errors = [];
            const validate = ajv.compile(schema_json_1.default);
            const valid = validate(config);
            if (!valid) {
                errors.push(...validate.errors);
            }
            // Resolve paths.
            const rootDir = path_1.default.dirname(src);
            const baseDir = path_1.default.resolve(rootDir, (_b = (_a = config.build) === null || _a === void 0 ? void 0 : _a.baseDir) !== null && _b !== void 0 ? _b : '');
            const publicDir = path_1.default.resolve(baseDir, (_d = (_c = config.build) === null || _c === void 0 ? void 0 : _c.publicDir) !== null && _d !== void 0 ? _d : '');
            // Env variable can be used to overwrite configuration.
            const id = process.env.FLEEK_SITE_ID || ((_e = config.site) === null || _e === void 0 ? void 0 : _e.id);
            const team = process.env.FLEEK_TEAM_ID || ((_f = config.site) === null || _f === void 0 ? void 0 : _f.team);
            if (!baseDir.startsWith(rootDir)) {
                errors.push({
                    dataPath: '/build/baseDir',
                    message: "baseDir is out of project's root.",
                });
            }
            if (!publicDir.startsWith(rootDir)) {
                errors.push({
                    dataPath: '/build/publicDir',
                    message: "publicDir is out of project's root.",
                });
            }
            if (!id) {
                errors.push({
                    dataPath: '/site/id',
                    message: 'siteId is required.',
                });
            }
            if (errors.length || !valid) {
                return { errors };
            }
            return {
                site: Object.assign(Object.assign({}, config.site), { id: id, team: team }),
                build: Object.assign(Object.assign({}, config.build), { rootDir,
                    baseDir,
                    publicDir }),
            };
        });
    }
    static mustLoadConfigruation() {
        return __awaiter(this, void 0, void 0, function* () {
            const configuration = yield this.loadConfiguration();
            if ('notFound' in configuration) {
                throw errors_1.Errors.runtimeErrorAndLog(`${exports.ConfigurationFilename} must exist`);
            }
            if ('errors' in configuration) {
                const error = configuration.errors.pop();
                throw errors_1.Errors.runtimeErrorAndLog(`configuration error: '${error === null || error === void 0 ? void 0 : error.message}' in path: ${error === null || error === void 0 ? void 0 : error.dataPath}`);
            }
            return configuration;
        });
    }
}
__decorate([
    memorize_decorator_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectUtils, "getGitRemoteUrl", null);
__decorate([
    memorize_decorator_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectUtils, "loadConfiguration", null);
exports.ProjectUtils = ProjectUtils;
