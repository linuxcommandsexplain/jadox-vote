import React, { useState, useEffect } from 'react';

const VoteComponent = ({ questions }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Initialisation des votes
  useEffect(() => {
    const initialVotes = {};
    questions.forEach((question, index) => {
      initialVotes[index] = question.options.reduce((acc, option) => {
        acc[option.id] = 0;
        return acc;
      }, {});
    });
    setVotes(initialVotes);
  }, [questions]);

  // Sauvegarde des votes dans localStorage
  useEffect(() => {
    const savedVotes = localStorage.getItem('voteData');
    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('voteData', JSON.stringify(votes));
  }, [votes]);

  const handleOptionSelect = (optionId) => {
    if (!hasVoted) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmitVote = () => {
    if (selectedOption && !hasVoted) {
      const questionIndex = currentQuestionIndex;
      setVotes(prev => ({
        ...prev,
        [questionIndex]: {
          ...prev[questionIndex],
          [selectedOption]: (prev[questionIndex][selectedOption] || 0) + 1
        }
      }));
      
      setHasVoted(true);
      
      // Réinitialiser après un délai pour permettre la navigation
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOption(null);
          setHasVoted(false);
        }
      }, 2000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasVoted(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setHasVoted(false);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestionIndex];
  const currentQuestion = getCurrentQuestion();

  // Calcul des résultats
  const calculateResults = (questionIndex) => {
    const questionVotes = votes[questionIndex] || {};
    const totalVotes = Object.values(questionVotes).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(questionVotes).map(([optionId, count]) => {
      const option = currentQuestion.options.find(opt => opt.id === optionId);
      return {
        option: option,
        count: count,
        percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
      };
    });
  };

  if (!currentQuestion) return null;

  const results = calculateResults(currentQuestionIndex);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        {currentQuestion.question}
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-center items-center mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                selectedOption === option.id 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${
                hasVoted && selectedOption === option.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : ''
              } ${
                hasVoted ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={() => handleOptionSelect(option.id)}
              disabled={hasVoted}
            >
              <div className="font-medium text-gray-800">{option.text}</div>
            </button>
          ))}
        </div>

        <button
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            !selectedOption || hasVoted
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
          }`}
          onClick={handleSubmitVote}
          disabled={!selectedOption || hasVoted}
        >
          {hasVoted ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.235 5.844 3.286 7.962"></path>
              </svg>
              Vote enregistré !
            </span>
          ) : (
            'Valider mon vote'
          )}
        </button>

        <div className="flex justify-between mt-6 space-x-4">
          <button
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
            }`}
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Précédent
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === questions.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Suivant
          </button>
        </div>
      </div>

      {/* Résultats */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Résultats</h3>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">{result.option.text}</span>
                <span className="text-sm font-semibold text-gray-600">
                  {result.count} vote{result.count > 1 ? 's' : ''}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${result.percentage}%` }}
                ></div>
              </div>
              <div className="text-right mt-1 text-sm text-gray-500">
                {result.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoteComponent;
