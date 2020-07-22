import React from 'react'

class Table extends React.Component {

  render() {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody >
          {(this.props.candidates).map((candidate) => {
            return (
              <tr key={candidate.id.toNumber()}>
                <th>{candidate.id.toNumber()}</th>
                <td>{candidate.name}</td>
                <td>{candidate.voteCount.toNumber()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
    // else
    //       return null;
  }
}

export default Table

