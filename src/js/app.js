// Provider is how web3 talks to blockchain
// they are basically websites running geth or parity nodes that talk to ethereum
App =
{
	web3Provider: null,
	contracts: {},
	account: '0x0',
	hasVotes: false,

	init: function () {
		return App.initWeb3();
	},

	// initialize connection of client side application to our local blockchain
	initWeb3: function () {
		// We get an instance of web3 attached to windows provided by Meta Mask
		// Meta Masks turns chrome into blockchain browser
		// (a browser that can connect to Etherium n/w)
		if (typeof web3 != 'undefined') {
			// When we login with meta Mask, it gives us a web3 provider
			App.web3Provider = web3.currentProvider;
			// set that web3 provider to our applicatrion web3 provider
			web3 = new Web3(web3.currentProvider);
		}

		// If no instance of web3 provider is provided
		else {
			// set web3 provider of application to our local blockchain instance
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
			web3 = new Web3(App.web3Provider);
		}

		return App.initContract();
	},

	initContract: function () {

		// Elecition.json is read from bs-config.json
		// In there directory is given as build/contracts
		// In there is , Election.json 
		$.getJSON("Election.json", function(election) {
			// Instatiate a new truffle contract from the artifact
			App.contracts.Election = TruffleContract(election);

			// Connect provider to interact with contract
			App.contracts.Election.setProvider(App.web3Provider);

			return App.render();
		});		
	},
	

	render: function () 
	{
		var electionInstance;
		var loader = $('#loader');
		var content = $('#content');

		// This is asyn function
		// So we are going to need to show and hide loader and content at appropriate places

		loader.show();
		content.hide();

		// Load user account data
		if(web3.currentProvider.enable){
			//For metamask
			web3.currentProvider.enable().then(function(acc){
				App.account = acc[0];
				$("#accountAddress").html("Your Account: " + App.account);
			});
		} else{
			App.account = web3.eth.accounts[0];
			$("#accountAddress").html("Your Account: " + App.account);
		}

		// Load contract data
		App.contracts.Election.deployed().then(function(instance) {
			electionInstance = instance;
			return electionInstance.candidatesCount();
		}).then(function(candidatesCount) {

			var candidatesResult = $("#candidatesResult");
			candidatesResult.empty();

			var candidateSelect = $("#candidateSelect");
			candidateSelect.empty();

			for (let i = 1; i <= candidatesCount; i++) {
				electionInstance.candidates(i).then(function (candidate) {
					var id = candidate[0];
					var name = candidate[1];
					var voteCount = candidate[2];

					// Render list of candidate name in select option
					var candidateSelectTemplate = "<option value = '" + id + "'>" + name + "</option>";
					candidateSelect.append(candidateSelectTemplate);

					// Render Candidate Result
					var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
					candidatesResult.append(candidateTemplate);
				});				
			}
			return electionInstance.voters(App.account);
		}).then(function (hasVoted) {
			// Do not allow user to vote
			if(hasVoted)
			{
				$('form').hide();
			}
			loader.hide();
			content.show();
		}).catch(function(error) {
			console.log(error);
		});
	},

	castVote: function()
	{
		var candidateId = $('#candidateSelect').val();
		// console.log(candidateId);
		debugger;
		App.contracts.Election.deployed().then( function(instance) {
			return instance.vote(candidateId, { from : App.account });
		}).then( function(result) {
			$('#content').hide();
			$('loader').show();
		}).catch(function (err) {
			console.log(err);
		});
	}
};

$(function () {
	$(window).load(function () {
		App.init();
	});
});
