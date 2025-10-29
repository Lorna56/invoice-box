import React, { useState, useEffect } from 'react';

const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback('');
      return;
    }

    let calculatedStrength = 0;
    let feedbackMsg = [];

    // Length check
    if (password.length >= 8) {
      calculatedStrength += 25;
    } else {
      feedbackMsg.push('Use at least 8 characters');
    }

    // Complexity checks
    if (/[A-Z]/.test(password)) {
      calculatedStrength += 25;
    } else {
      feedbackMsg.push('Include uppercase letters');
    }

    if (/[a-z]/.test(password)) {
      calculatedStrength += 25;
    } else {
      feedbackMsg.push('Include lowercase letters');
    }

    if (/[0-9]/.test(password)) {
      calculatedStrength += 12.5;
    } else {
      feedbackMsg.push('Include numbers');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      calculatedStrength += 12.5;
    } else {
      feedbackMsg.push('Include special characters');
    }

    setStrength(calculatedStrength);
    setFeedback(feedbackMsg.join(', '));
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Password strength: {getStrengthText()}</span>
        <span className="text-xs text-gray-600">{strength}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      {feedback && (
        <p className="text-xs text-gray-500 mt-1">
          Suggestions: {feedback}
        </p>
      )}
    </div>
  );
};

export default PasswordStrength;