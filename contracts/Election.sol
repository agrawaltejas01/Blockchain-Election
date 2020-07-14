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

    // We need to keep check that a user can only vote once
    // For that we need to keep a mapping of user
    // If user address is not in mapping, map will return false(default), telling user has not voted
    mapping(address => bool) public voters;

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


    // Solidity allows to pass meta data to function along with paramertes
    // vote(1 { from : .... }) => {} = metadata
    // from => address that has called vote function
    // from is then converted into msg.sender
    function vote (uint _candidateId) public
    {
        // valid candidateId
        require(_candidateId > 0 && _candidateId <= candidatesCount, "candidateId is not valid");

        // require that voter has not already voted
        require(!voters[msg.sender], "Voter has already voted");

        // record that user has voted
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
    }

    // Election.deployed().then(function(i) { app = i;})
    // web3.eth.getAccounts().then(function(acc) {account = acc } ) => Gives list of all availabel account
    // account[0]
    // app.vote(1, { from : account[0] }) => Success
    // app.vote(1, { from : account[0] }) => Fail (reason: 'Voter has already voted', )
    // app.vote(1, { from : account[2] }) => Success
    // app.vote(1, { from : account[5] }) => Success
    // app.vote(1, { from : account[5] }) => Fail (reason: 'Voter has already voted', )
    // app.vote(6, { from : account[3] } ) => Fail (reason: 'candidateId is not valid', )
}