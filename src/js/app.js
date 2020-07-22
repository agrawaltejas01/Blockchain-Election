import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Election from '../../build/contracts/Election.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'
import Table from './Table'

class App extends React.Component {
    constructor(props) {
        super(props)
        // Initializing Varirable
        this.state = {
            account: '0x0',
            candidates: [],
            hasVoted: false,
            loading: true,
            voting: false,
        }
        // ----------------------------------------------------------------------------------------------
        // initialize connection of client side application to our local blockchain

        // We get an instance of web3 attached to windows provided by Meta Mask
        // Meta Masks turns chrome into blockchain browser
        // (a browser that can connect to Etherium n/w)
        if (typeof web3 != 'undefined') {
            // When we login with meta Mask, it gives us a web3 provider
            this.web3Provider = web3.currentProvider;
        }
        // If no instance of web3 provider is provided
        else {
            // set web3 provider of application to our local blockchain instance
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
        }
        // set the web3 provider to our application web3 provider
        this.web3 = new Web3(this.web3Provider)

        // ----------------------------------------------------------------------------------------------
        // Get election contract

        // Instatiate a new truffle contract from the artifact
        this.election = TruffleContract(Election)

        // Connect provider to interact with contract
        this.election.setProvider(this.web3Provider)
        // ----------------------------------------------------------------------------------------------

        this.castVote = this.castVote.bind(this)
        this.watchEvents = this.watchEvents.bind(this)

    }

    componentDidMount() {
        // Get User account details

        if (web3.currentProvider.enable) {
            //For metamask
            web3.currentProvider.enable().then((acc) => {
                // account = acc[0]
                this.setState({ account: acc[0] })
            });
        } else {
            // account = web3.eth.accounts[0];
            this.setState({ account: web3.eth.accounts[0] })
        }


        // ----------------------------------------------------------------------------------------------

        // Get ElectionInstance
        this.election.deployed().then((instance) => {
            this.electionInstance = instance;

            this.watchEvents();

            // Get candidates
            this.electionInstance.candidatesCount().then((candidatesCount) => {
                for (var i = 1; i <= candidatesCount; i++) {
                    this.electionInstance.candidates(i).then((candidate) => {
                        const candidates = [...this.state.candidates]
                         console.log("IGI before candidates.push " + candidates)
                        candidates.push({
                            id: candidate[0],
                            name: candidate[1],
                            voteCount: candidate[2]
                        });
                        this.setState({ candidates : candidates })

                    })
                }
                console.log(this.state.candidates);
            })

            // Check if voter has votes
            this.electionInstance.voters(this.state.account).then((hasVoted) => {
                this.setState({ hasVoted, loading: false })
            })
        })
    }

    watchEvents() {
        this.electionInstance.votedEvent({}, {
            fromBlock: 0,
            toBlock: 'latest'
        }).watch((err, event) => {
            this.setState({ voting: false })
        })
    }

    castVote(candidateId) {
        this.setState({ voting: true })
        this.electionInstance.vote(candidateId, { from: this.state.account }).then((result) =>
            this.setState({ hasVoted: true })
        )
        var index = this.state.candidates.findIndex(candidate.id == candidateId);
        this.state.candidates[index].voteCount++;
    }

    render() {
        return (
            <div className="row">
                <div className='col-lg-12 text-center' >
                    <h1> Election Result </h1>
                    <br />
                    {
                        this.state.loading || this.state.voting || !this.state.candidates.length
                            ? <p className='text-center'>Loading...</p>
                            : <Content
                                account={this.state.account}
                                candidates={this.state.candidates}
                                hasVoted={this.state.hasVoted}
                                castVote={this.castVote} />
                    }
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)