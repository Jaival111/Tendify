import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { score, criteria } = useMemo(() => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    const criteria = [
      { name: 'At least 8 characters', met: hasLength },
      { name: 'Contains uppercase letter', met: hasUpper },
      { name: 'Contains lowercase letter', met: hasLower },
      { name: 'Contains number', met: hasNumber },
      { name: 'Contains special character', met: hasSpecial },
    ];
    
    const metCount = criteria.filter(c => c.met).length;
    let score = 0;
    
    if (metCount === 1) score = 1;
    else if (metCount === 2) score = 2;
    else if (metCount === 3) score = 3;
    else if (metCount === 4) score = 4;
    else if (metCount === 5) score = 5;
    
    return { score, criteria };
  }, [password]);
  
  const strengthLabel = useMemo(() => {
    if (score === 0) return { text: 'Very Weak', color: 'bg-gray-200' };
    if (score === 1) return { text: 'Very Weak', color: 'bg-red-500' };
    if (score === 2) return { text: 'Weak', color: 'bg-orange-500' };
    if (score === 3) return { text: 'Moderate', color: 'bg-yellow-500' };
    if (score === 4) return { text: 'Strong', color: 'bg-green-500' };
    return { text: 'Very Strong', color: 'bg-green-600' };
  }, [score]);
  
  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Password strength:</span>
        <span className={`text-xs font-medium ${
          score <= 1 ? 'text-red-500' :
          score === 2 ? 'text-orange-500' :
          score === 3 ? 'text-yellow-500' : 'text-green-500'
        }`}>
          {strengthLabel.text}
        </span>
      </div>
      
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strengthLabel.color} transition-all duration-300`}
          style={{ width: `${(score / 5) * 100}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center text-xs">
            {criterion.met ? (
              <Check className="h-3 w-3 text-green-500 mr-1.5" />
            ) : (
              <X className="h-3 w-3 text-gray-400 mr-1.5" />
            )}
            <span className={criterion.met ? 'text-gray-700' : 'text-gray-400'}>
              {criterion.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;