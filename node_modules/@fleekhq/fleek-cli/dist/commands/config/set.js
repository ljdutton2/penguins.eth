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
const command_1 = require("@oclif/command");
const container_1 = __importDefault(require("../../dependency-injection/container"));
const config_controller_1 = require("../../controllers/config/config.controller");
const environment_type_1 = require("../../services/environment/enums/environment-type");
const logger_1 = require("../../common/logger");
class ConfigSet extends command_1.Command {
    constructor() {
        super(...arguments);
        this.controller = container_1.default.resolve(config_controller_1.ConfigController);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { flags: { environment }, } = this.parse();
            try {
                yield this.controller.updateEnvironmentConfig(environment);
                logger_1.Logger.log(`successfully updated your environment to ${environment}`);
            }
            catch (error) {
                logger_1.Logger.error('Could not update your environment at this time, please try again later');
            }
        });
    }
}
exports.default = ConfigSet;
ConfigSet.description = 'set certain values in the config';
ConfigSet.hidden = true;
ConfigSet.flags = {
    environment: command_1.flags.string({
        description: 'Environment name.',
        required: true,
        options: [environment_type_1.EnvironmentType.dev, environment_type_1.EnvironmentType.prd, environment_type_1.EnvironmentType.stg],
    }),
};
