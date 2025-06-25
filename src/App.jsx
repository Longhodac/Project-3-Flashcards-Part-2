import { useState } from 'react'; 
import Card from './components/Card';
import './App.css';

const App = () => {
    const flashCards = [
        {
            id: 1,
            question: "A type of machine learning where the algorithm learns from labeled training data to make predictions on new, unseen data.",
            answer: "Supervised Learning",
        },
        {
            id: 2,
            question: "When a model learns the training data too well, including noise and outliers, resulting in poor performance on new data.?",
            answer: "Overfitting",
        },
        {
            id: 3,
            question: "A deep learning architecture particularly effective for image recognition tasks.?",
            answer: "CNN",
        },
        {
            id: 4,
            question: "To prevent overfitting by adding a penalty term to the loss function, encouraging simpler models.?",
            answer: "Regularization",
        },
        {
            id: 5,
            question: "What is gradient descent?",
            answer: "An optimization algorithm used to minimize the cost function by iteratively moving toward the steepest descent.",
        },
        {
            id: 6,
            question: "What measures accuracy of positive predictions and what measures how many actual positives were found.",
            answer: "Precision and Recall",
        },
        {
            id: 7,
            question: "An ensemble learning method that combines multiple decision trees and uses voting to make final predictions.",
            answer: "Random Forest",
        },
        {
            id: 8,
            question: "A technique to assess model performance by splitting data into multiple folds and training/testing on different combinations.",
            answer: "Cross-validation",
        },
        {
            id: 9,
            question: "When gradients become exponentially small in deep networks, making it difficult to train earlier layers effectively.?",
            answer: "Vanishing Gradient Problem",
        },
        {
            id: 10,
            question: "A type of ML where an agent learns to make decisions by interacting with an environment and receiving rewards or penalties.",
            answer: "Reinforcement Learning",
        }
    ];

    const [currCardsIndex, setCurrCardsIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [answerFeedback, setAnswerFeedback] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [cardOrder, setCardOrder] = useState(flashCards.map((_, index) => index));
    const [masteredCards, setMasteredCards] = useState(new Set());
    
    const availableCards = flashCards.filter((_, index) => !masteredCards.has(index));
    const availableCardOrder = cardOrder.filter(index => !masteredCards.has(index));
    const currentCard = availableCards[availableCardOrder.indexOf(currCardsIndex)] || availableCards[0];
    const currentCardIndex = availableCardOrder.indexOf(currCardsIndex);

    const fuzzyMatch = (userInput, correctAnswer) => {
        const normalizeText = (text) => {
            return text.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };

        const normalizedUser = normalizeText(userInput);
        const normalizedCorrect = normalizeText(correctAnswer);

        // Exact match
        if (normalizedUser === normalizedCorrect) return true;

        // Partial match - check if user answer contains key words
        const userWords = normalizedUser.split(' ');
        const correctWords = normalizedCorrect.split(' ');
        
        // Count matching words
        const matchingWords = userWords.filter(word => 
            correctWords.some(correctWord => 
                correctWord.includes(word) || word.includes(correctWord)
            )
        );

        // Consider correct if at least 60% of words match or contains key terms
        return matchingWords.length >= Math.ceil(correctWords.length * 0.6);
    };

    const handleFlip = () => {
        if (showAnswer) {
            setIsFlipped(!isFlipped);
        }
    };

    const handleSubmitAnswer = () => {
        if (!userAnswer.trim()) return;

        const isCorrect = fuzzyMatch(userAnswer, currentCard.answer);
        
        if (isCorrect) {
            setAnswerFeedback({ type: 'correct', message: 'Correct! Great job!' });
            setCurrentStreak(prev => {
                const newStreak = prev + 1;
                if (newStreak > longestStreak) {
                    setLongestStreak(newStreak);
                }
                return newStreak;
            });
        } else {
            setAnswerFeedback({ type: 'incorrect', message: 'Not quite right. Try again or see the answer!' });
            setCurrentStreak(0);
        }
        
        setShowAnswer(true);
        
        // Clear feedback after 3 seconds
        setTimeout(() => {
            setAnswerFeedback(null);
        }, 3000);
    };

    const handleNextCard = () => {
        if (currentCardIndex < availableCardOrder.length - 1) {
            const nextIndex = availableCardOrder[currentCardIndex + 1];
            setCurrCardsIndex(nextIndex);
            resetCardState();
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            const prevIndex = availableCardOrder[currentCardIndex - 1];
            setCurrCardsIndex(prevIndex);
            resetCardState();
        }
    };

    const resetCardState = () => {
        setIsFlipped(false);
        setUserAnswer('');
        setAnswerFeedback(null);
        setShowAnswer(false);
    };


    const handleMasterCard = () => {
        const newMastered = new Set(masteredCards);
        newMastered.add(currCardsIndex);
        setMasteredCards(newMastered);
        
        // Move to next available card
        const remainingCards = cardOrder.filter(index => !newMastered.has(index));
        if (remainingCards.length > 0) {
            const nextIndex = remainingCards[0];
            setCurrCardsIndex(nextIndex);
            resetCardState();
        }
    };

    const handleRestart = () => {
        setMasteredCards(new Set());
        setCurrCardsIndex(0);
        setCardOrder(flashCards.map((_, index) => index));
        resetCardState();
        setCurrentStreak(0);
        setLongestStreak(0);
    };

    const isAtBeginning = currentCardIndex === 0;
    const isAtEnd = currentCardIndex === availableCardOrder.length - 1;

    if (availableCards.length === 0) {
        return (
            <div className="completion-screen">
                <div className="completion-content">
                    <h1>🎉 Congratulations!</h1>
                    <p>You've mastered all the cards!</p>
                    <p className="final-streak">Final longest streak: {longestStreak}</p>
                    <button onClick={handleRestart} className="restart-btn">
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <div className='app-container'>
                <header className='app-header'>
                    <h1 className='app-title'>
                        Machine Learning Flashcards
                    </h1>
                    <p className='app-description'>
                        Practice your knowledge of machine learning concepts. Enter your answer before flipping!
                    </p> 
                    <div className='app-stats'>
                        <span>Available: {availableCards.length}/{flashCards.length}</span>
                        <span>Current: {currentCardIndex + 1}/{availableCardOrder.length}</span>
                        <span>Streak: {currentStreak}</span>
                        <span>Best: {longestStreak}</span>
                        <span>Mastered: {masteredCards.size}</span>
                    </div> 
                </header>

                <Card
                    card={currentCard}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                    userAnswer={userAnswer}
                    setUserAnswer={setUserAnswer}
                    onSubmitAnswer={handleSubmitAnswer}
                    answerFeedback={answerFeedback}
                    showAnswer={showAnswer}
                />

                <div className='navigation-buttons'>
                    <button 
                        onClick={handlePrevCard} 
                        disabled={isAtBeginning}
                        className={`nav-btn ${isAtBeginning ? 'disabled' : ''}`}
                    >
                        ← Previous
                    </button>
                    
                    <button 
                        onClick={handleNextCard} 
                        disabled={isAtEnd}
                        className={`nav-btn ${isAtEnd ? 'disabled' : ''}`}
                    >
                        Next →
                    </button>
                </div>

                <div className='extra-buttons'>
                    
                    <button onClick={handleMasterCard} className="btn btn-primary">
                        Master Card
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;