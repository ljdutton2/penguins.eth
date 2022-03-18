const PenguinContract = artifacts.require("PenguinContract");

module.exports = function (deployer) {
    deployer.deploy(PenguinContract);
}