import React, {useState, useEffect} from 'react'; 

const Round = ({round, currentRound, yesScore, noScore, isPlayed}) => {
  const [highlightY, setHighlightY] = useState(false);
console.log(isPlayed);
  // Randomly assign a background color to either Y or N section on component load
  useEffect(() => {
    setHighlightY(Math.random() < 0.5); // Randomly sets highlight to Y or N
  }, [round]); 
  // Determine which score is higher
  const yesIsHigher = yesScore > noScore;
  const noIsHigher = noScore > yesScore;
  return (
    <div className="game_round">
    <div className={`y-section ${highlightY && !isPlayed? 'highlight' : isPlayed ? "played" : ''} ${yesIsHigher ? 'higher_section' : ''}`}><p> <span className="Y_icon">Y</span><span className='yes_count'>{yesScore}</span></p></div>
    <div className="round_section">{round}</div>
    <div  className={`n-section ${!highlightY  && !isPlayed ? 'highlight' : isPlayed  ? "played" : ''} ${noIsHigher ? 'higher_section' : ''}`}><p><span className='no_count'>{noScore}</span> <span className="N_icon">N</span></p></div>
  </div>
  )
}

export default Round;