
import React from 'react';
import { Message } from '../types';
import { AnalysisView } from './AnalysisView';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${
        isUser 
        ? 'bg-blue-600 text-white rounded-tr-none' 
        : 'bg-white shadow-md border border-gray-100 rounded-tl-none'
      }`}>
        <div className="flex items-center gap-2 mb-2 opacity-70">
          <i className={`fas ${isUser ? 'fa-user' : 'fa-robot'}`}></i>
          <span className="text-xs font-semibold uppercase tracking-widest">
            {isUser ? 'You' : 'PhishGuard AI'}
          </span>
          <span className="text-[10px]">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="whitespace-pre-wrap text-sm leading-relaxed mb-4">
          {isUser ? message.content : (
            <div>
              <p className="mb-2">Assessment complete for the provided content:</p>
              <div className="bg-gray-50 p-3 rounded-lg text-gray-400 italic text-[10px] mb-4 truncate">
                "{message.content.substring(0, 100)}..."
              </div>
            </div>
          )}
        </div>

        {!isUser && message.analysis && (
          <AnalysisView analysis={message.analysis} />
        )}
      </div>
    </div>
  );
};
