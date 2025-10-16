'use client';

import React, { FC, useState, useRef, useEffect } from 'react';

interface CardBodyProps {
  title: string;
  body: string;
}

const CardBody: FC<CardBodyProps> = ({ title, body }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsClamped(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [body]);

  if (!title && !body) return null;

  return (
    <div className="px-4 pb-4">
      {title && (
        <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
      )}
      {body && (
        <>
          <p
            ref={textRef}
            className={`text-gray-700 whitespace-pre-wrap text-sm ${!isExpanded && 'line-clamp-3'}`}
          >
            {body}
          </p>
          {isClamped && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-indigo-600 hover:underline font-semibold text-sm mt-1"
            >
              ...Show More
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CardBody;
