var Election = artifacts.require("./Election.sol");

contract("Election", function (accounts) {

    // Check no if candidates
    it("Initializes with 2 candidates", function () {
        return Election.deployed().then(function (instance) {
            return instance.candidatesCount();
        }).then(function (count) {
            assert.equal(count, 2, "2 candidates are not initialized");
        });
    });

    // Check if correct values were initialized for candidates
    var electionInstance;

    it("Candidates are initialized with correct values", function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function (candidate) {
            assert.equal(candidate['id'], 1, 'incorrect id 1');
            assert.equal(candidate['name'], "Candidate 1", 'incorrect name 1');
            assert.equal(candidate['voteCount'], 0, 'incorrect voteCount 1');

            // Call 2nd candidate here for next chain
            return electionInstance.candidates(2);
        }).then(function (candidate) {
            assert.equal(candidate['id'], 2, 'incorrect id 2');
            assert.equal(candidate['name'], "Candidate 2", 'incorrect name 2');
            assert.equal(candidate['voteCount'], 0, 'incorrect voteCount 2');
        });
    });

    it('a voter can vote', function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, { from: accounts[0] });
            // vote function will return a recipet
        }).then(function (recipt) {
            // Here check if hasVoted event was triggered
            assert.equal(recipt.logs.length, 1, "votedEvent was not triggered");
            assert.equal(recipt.logs[0].event, "votedEvent", "Incorrect event was triggered after voting");
            assert.equal(recipt.logs[0].args._candidateId.toNumber(), candidateId, "Wrong candidateId was triggered in votedEvent ")

            return electionInstance.voters(accounts[0]);
        }).then(function (voted) {
            // Check if this account address was added in voters list
            assert(voted, "The voter was not marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function (candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "Vote was not incremented");
        });
    });

    it('Invalid candidateId cannot be voted', function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            return electionInstance.vote(99, { from: accounts[6] })
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, "Invalid candidateId was allowed to vote");
            return electionInstance.candidates(1);
        }).then(function (candidate1) {
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "candidate 1 was wrongly voted");
            return electionInstance.candidates(2);
        }).then(function (candidate2) {
            var voteCount = candidate2[2];
            assert.equal(voteCount, 0, "candidate 2 was wrongly voted");
        });
    });

    it('A voter cannot vote twice', function () {
        Election.deployed().then(function (instance) {
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId, { from: accounts[7] });
            return electionInstance.candidates(candidateId);
        }).then(function (candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "Candidate was not voted for the first time");
            // Vote again
            return electionInstance.vote(candidateId, { from: accounts[7] });
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf("revert") >= 0, "Voter was able to vote 2nd time");
            return electionInstance.candidates(1);
        }).then(function (candidate1) {
            voteCount = candidate1[2];
            assert.equal(voteCount, 1, "Candiate 1 did not recieve 1 vote");
            return electionInstance.candidates(2);
        }).then(function (candidate2) {
            voteCount = candidate2[2];
            assert.equal(voteCount, 1, "Candiate 2 did not recieve 1 vote");
        });
    });

});