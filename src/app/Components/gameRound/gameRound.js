import React, {useState, useEffect} from 'react'; 
import "./gameRound.css";

const Round = ({round, yesScore, noScore, isPlayed, nullScore}) => {
  const [highlightY, setHighlightY] = useState(false);

  // Randomly assign a background color to either Y or N section on component load
  useEffect(() => {
    setHighlightY(Math.random() < 0.5); // Randomly sets highlight to Y or N
  }, [round]); 
  // Determine which score is higher
  const yesIsHigher = yesScore > noScore;
  const noIsHigher = noScore > yesScore;
  return (
    <div className="game_round">
  <div className={`y-section ${isPlayed && !yesIsHigher && yesScore !== noScore && "round-highlight"}`}>{!isPlayed ? "Y" : yesScore}</div>
    <div className="round_section">{!isPlayed ? <div className='round_ball'>opp {round}</div> : nullScore ? <span className='round_center_text'>NULL</span> : !yesIsHigher ? <span className='round_center_text'>Y</span> : <span className='round_center_text'>N</span>}</div>
    <div className={`y-section ${isPlayed && yesIsHigher && "round-highlight"}`}>{!isPlayed ? "N" : noScore}</div>
  </div>
  )
}

export default Round;