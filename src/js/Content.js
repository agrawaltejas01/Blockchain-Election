import React from 'react'
import Table from './Table'
import Form from './Form'

class Content extends React.Component {
 
  render() {
    return (
      <div>

        {this.props.candidates.length}
        {
          this.props.candidates.length
            ? <Table candidates={this.props.candidates} />
            : <p className='text-center'>Loading...</p>
        }

        <hr />
        {/* {!this.props.hasVoted ?
          <Form candidates={this.props.candidates} castVote={this.props.castVote} />
          : null
        } */}
        <Form candidates={this.props.candidates} castVote={this.props.castVote} />
        <p>Your account: {this.props.account}</p>
      </div>
    )
  }
}

export default Content