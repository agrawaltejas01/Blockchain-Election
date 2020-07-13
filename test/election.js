var Election = artifacts.require("./Election.sol");

contract("Election", function(account){

    // Check no if candidates
    it("Initializes with 2 candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count) {
            assert.equal(count, 2, "2 candidates are not initialized");
        });
    });

    // Check if correct values were initialized for candidates
    var electionInstance;

    it("Candidates are initialized with correct values", function()
    {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate) {
            assert.equal(candidate['id'], 1, 'incorrect id 1');
            assert.equal(candidate['name'], "Candidate 1", 'incorrect name 1');
            assert.equal(candidate['voteCount'], 0, 'incorrect voteCount 1');

            // Call 2nd candidate here for next chain
            return electionInstance.candidates(2);
        }).then(function(candidate) {
            assert.equal(candidate['id'], 2, 'incorrect id 2');
            assert.equal(candidate['name'], "Candidate 2", 'incorrect name 2');
            assert.equal(candidate['voteCount'], 0, 'incorrect voteCount 2');
        });
    });
});