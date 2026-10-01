import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  isLoading?: boolean;
  error?: string;
  onResend?: () => void;
  attemptsLeft?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  isLoading = false,
  error,
  onResend,
  attemptsLeft
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are entered somehow
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check completion
    const otpString = newOtp.join('');
    if (otpString.length === length) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move to previous if current is empty
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else {
        // Just clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length).replace(/\D/g, '');
    
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < length) {
          newOtp[i] = pastedData[i] ?? '';
        }
      }
      setOtp(newOtp);
      
      // Focus the next empty input or the last one
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();

      if (pastedData.length === length) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={isLoading}
            className={clsx(
              'w-12 h-14 text-center text-2xl font-bold rounded-xl bg-gray-800 border focus:outline-none transition-colors',
              error ? 'border-red-500 focus:border-red-500 text-red-500' : 'border-gray-600 focus:border-orange-500 text-white',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={`Digit ${index + 1} of OTP`}
          />
        ))}
      </div>
      
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      
      <div className="flex flex-col items-center gap-2 text-sm">
        {attemptsLeft !== undefined && (
          <p className="text-gray-400">
            {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
          </p>
        )}
        {onResend && (
          <button
            type="button"
            onClick={onResend}
            disabled={isLoading}
            className="text-orange-500 hover:text-orange-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};
