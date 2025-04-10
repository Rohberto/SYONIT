import React from 'react'

const Points = ({currentRound}) => {
  return (
    <div className='game_point_container'>
    <div className='game_Points_container'>
        <div className='points_text'>
          <h4>No of players</h4>
          <p>1000</p>
        </div>

        <div className="points_text">
        <h4>Game Round:</h4>
          <p>ROUND {currentRound}/6</p>
  </div>

        <div className="points_text">
        <h4>Game ID:</h4>
          <p>SYON_004</p>
  </div>

        <div className='points_text'>
        <h4>MY Points</h4>
        <p>1</p>
        </div>
    </div>
    </div>
  )
}

export default Points;
