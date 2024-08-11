import React, { useState, useEffect } from 'react';

// Регулярное выражение для проверки email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface EmailCheckingProps {
  email: string;
  onValidEmail?: (email: string) => void;
  onInvalidEmail?: () => void;
}

const EmailChecking: React.FC<EmailCheckingProps> = ({ email, onValidEmail, onInvalidEmail }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (emailRegex.test(email)) {
      setIsValid(true);
      onValidEmail?.(email);
    } else {
      setIsValid(false);
      onInvalidEmail?.();
    }
  }, [email]);

  return null;
};

export default EmailChecking;