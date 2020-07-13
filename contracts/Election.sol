// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

// For smoke test purpose
// contract Election
// {
//     // Automatically assigns a getter as candidarte()
//     string public candidate;

//     constructor() public
//     {
//         candidate = "Candidate 1";
//     }
// }

// Now when we run following contract, data in the blockchain will be modified
// This is not supposed to be happening
// Hence add --reset flag to truffle migrate
// truffle migrate --reset
contract Election
{
    // Model for a candidate
    struct Candidate
    {
        uint id;
        string name;
        uint voteCount;
    }

    // Array of Candidates
    // Created by using mapping

    // Store and Fetch candidates
    mapping(uint => Candidate) public candidates;

    // mapping does not tell length
    // Also does not allow to iterate over variable
    // Hence a variable for keeping count of that

    uint public candidatesCount;
    constructor() public
    {
        addCandidates("Candidate 1");
        addCandidates("Candidate 2");
    }

    function addCandidates (string memory _name) private
    {
        candidatesCount ++;

        // Following will add uint => Candidate mapping in candidates variable
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Election.deployed().then(function(i){ app = i; }) => instantiate Election contract
    // app.candidates(1).then(function(c){ candidate = c; }) => get value of candidate(1) in candidate variable

    // candidate['id'].toNumber
    // candidate['name']

}