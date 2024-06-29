import React from 'react';

interface ResultDisplayProps {
  result: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  return (
    <div className="result-display">
      <h2>Result: {result}</h2>
      <button onClick={onReset}>Try Again</button>
    </div>
  );
};

export default ResultDisplay;
