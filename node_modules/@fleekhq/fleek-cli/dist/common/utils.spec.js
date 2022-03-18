"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
describe('Utils', () => {
    describe('getProgramArguments', () => {
        it('should return jests cli execution objects running', () => {
            expect(utils_1.Utils.getProgramArguments()).toHaveProperty('command');
            expect(utils_1.Utils.getProgramArguments()).toHaveProperty('options');
            expect(utils_1.Utils.getProgramArguments()).toHaveProperty('subcommands');
        });
    });
    describe('deepClone', () => {
        it('should deep clone a object', () => {
            const foo = { bar: true };
            const clone = utils_1.Utils.deepClone(foo);
            clone.bar = false;
            expect(foo).not.toEqual(clone);
        });
    });
});
