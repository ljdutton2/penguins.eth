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
const site_controller_1 = require("../../controllers/site/site.controller");
class Deploy extends command_1.Command {
    constructor() {
        super(...arguments);
        this.controller = container_1.default.resolve(site_controller_1.SiteController);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { flags: flag } = this.parse(Deploy);
            yield this.controller.deploy(flag.hash);
        });
    }
}
exports.default = Deploy;
Deploy.description = 'Deploy site to fleek';
Deploy.flags = {
    hash: command_1.flags.string({}),
};
