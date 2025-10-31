import React, { useState, useEffect } from 'react';

const PasswordStrength = ({ 
  password, 
  onValidationChange, 
  minStrength = 60,
  showError = false,
  errorMessage = "Please create a stronger password before continuing"
}) => {
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
      setIsValid(false);
      onValidationChange && onValidationChange(false);
      return;
    }

    // Check each requirement
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    setRequirements(newRequirements);

    // Calculate strength based on met requirements
    const metRequirements = Object.values(newRequirements).filter(Boolean).length;
    let calculatedStrength = (metRequirements / 5) * 100;

    // Bonus points for length beyond minimum
    if (password.length >= 12) calculatedStrength += 10;
    if (password.length >= 16) calculatedStrength += 10;

    // Cap at 100%
    calculatedStrength = Math.min(calculatedStrength, 100);
    setStrength(calculatedStrength);

    // Check if password meets minimum strength and all requirements
    const passwordValid = calculatedStrength >= minStrength && metRequirements === 5;
    setIsValid(passwordValid);
    onValidationChange && onValidationChange(passwordValid);
  }, [password, minStrength, onValidationChange]);

  const getStrengthColor = () => {
    if (strength <= 20) return 'bg-red-500';
    if (strength <= 40) return 'bg-orange-500';
    if (strength <= 60) return 'bg-yellow-500';
    if (strength <= 80) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength <= 20) return 'Very Weak';
    if (strength <= 40) return 'Weak';
    if (strength <= 60) return 'Fair';
    if (strength <= 80) return 'Good';
    return 'Very Strong';
  };

  const getRequirementIcon = (met) => {
    return met ? (
      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  const getRequirementClass = (met) => {
    return met ? 'text-green-600' : 'text-gray-500';
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Password strength: {getStrengthText()}</span>
        <span className="text-sm text-gray-600">{strength}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Password must contain:</p>
        
        <div className="flex items-center space-x-2">
          {getRequirementIcon(requirements.length)}
          <span className={`text-sm ${getRequirementClass(requirements.length)}`}>
            At least 8 characters
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {getRequirementIcon(requirements.uppercase)}
          <span className={`text-sm ${getRequirementClass(requirements.uppercase)}`}>
            At least one uppercase letter (A-Z)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {getRequirementIcon(requirements.lowercase)}
          <span className={`text-sm ${getRequirementClass(requirements.lowercase)}`}>
            At least one lowercase letter (a-z)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {getRequirementIcon(requirements.number)}
          <span className={`text-sm ${getRequirementClass(requirements.number)}`}>
            At least one number (0-9)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {getRequirementIcon(requirements.special)}
          <span className={`text-sm ${getRequirementClass(requirements.special)}`}>
            At least one special character (!@#$%^&*)
          </span>
        </div>
      </div>
      
      {strength < 60 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            <strong>Tip:</strong> A strong password includes a mix of letters, numbers, and special characters. Consider using a passphrase that's easy for you to remember but hard for others to guess.
          </p>
        </div>
      )}
      
      {showError && !isValid && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">
                {errorMessage}
              </p>
              {!allRequirementsMet && (
                <p className="text-xs text-red-600 mt-1">
                  Please complete all the requirements above.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {isValid && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                Password meets all requirements
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;
