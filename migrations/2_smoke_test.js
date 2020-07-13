var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
};

// use
// truffle console
// Election.deployed().then(function(instance) { app = instance })
// app.candidate()  -> 'Candidate 1'
