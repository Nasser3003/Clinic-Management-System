import React from 'react';

interface MessageAlertProps {
  message: { type: string; text: string };
}

const MessageAlert: React.FC<MessageAlertProps> = ({ message }) => {
  if (!message.text) return null;

  return (
    <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
      {message.text}
    </div>
  );
};

export default MessageAlert;