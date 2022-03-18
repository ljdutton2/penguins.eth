"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const conf_1 = __importDefault(require("conf"));
const environment_type_1 = require("../environment/enums/environment-type");
let DatabaseService = class DatabaseService {
    constructor() {
        this.conf = new conf_1.default({
            defaults: {
                environment: environment_type_1.EnvironmentType.prd,
                session: undefined,
                teams: {},
            },
        });
    }
    get(key) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return this.conf.get(key);
    }
    set(key, value) {
        if (value === undefined) {
            this.conf.delete(key);
        }
        else {
            this.conf.set(key, value);
        }
    }
};
DatabaseService = __decorate([
    inversify_1.injectable()
], DatabaseService);
exports.DatabaseService = DatabaseService;
