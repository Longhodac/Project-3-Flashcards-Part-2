const Card = ({ card, isFlipped, onFlip, userAnswer, setUserAnswer, onSubmitAnswer, answerFeedback, showAnswer }) => {
    return(
        <div className="flash-card-container">
            <div className={`flash-card ${isFlipped ? 'flipped' : ''}`} onClick={showAnswer ? onFlip : undefined}>
                <div className="flash-card-front">
                    <h2>{card.question}</h2>
                    
                    {!showAnswer && !isFlipped && (
                        <div className="answer-input-container">
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Enter your answer..."
                                className="answer-input"
                                onClick={(e) => e.stopPropagation()}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && userAnswer.trim()) {
                                        e.stopPropagation();
                                        onSubmitAnswer();
                                    }
                                }}
                            />
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSubmitAnswer();
                                }}
                                className="submit-btn"
                                disabled={!userAnswer.trim()}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                    
                    {answerFeedback && (
                        <div className={`feedback ${answerFeedback.type}`}>
                            {answerFeedback.message}
                        </div>
                    )}
                    
                    <div className="card-hint">
                        {!showAnswer ? 'Enter your answer first' : 'Click to flip'}
                    </div>
                </div>
                
                <div className="flash-card-back">
                    <p>{card.answer}</p>
                    <div className="card-hint">
                        Click to see question again
                    </div>
                </div>
            </div>
        </div>        
    );
}

export default Card;