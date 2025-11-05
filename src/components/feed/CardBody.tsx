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
    // This function checks if the text is overflowing
    const checkClamping = () => {
      if (textRef.current) {
        // Check if the full height of the content (scrollHeight)
        // is greater than the visible height (clientHeight)
        // This is checked while 'line-clamp-2' is active (when isExpanded is false)
        const hasOverflow =
          textRef.current.scrollHeight > textRef.current.clientHeight;
        setIsClamped(hasOverflow);
      }
    };

    // Run the check on mount and when the body text changes
    // Using a small timeout to allow for rendering
    const timer = setTimeout(checkClamping, 50);

    // Re-check on window resize, as this can change the text flow
    window.addEventListener('resize', checkClamping);

    // Cleanup listener and timer
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkClamping);
    };
  }, [body]); // Re-run effect if the 'body' prop changes

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
            className={`text-gray-700 whitespace-pre-wrap text-sm ${
              !isExpanded ? 'line-clamp-2' : ''
            }`}
          >
            {body}
          </p>

          {/* Show "Show More" only if it's clamped AND not expanded */}
          {isClamped && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-indigo-600 hover:underline font-semibold text-sm mt-1 cursor-pointer"
            >
              ...Show More
            </button>
          )}

          {/* Show "Show Less" only if it's clamped AND expanded */}
          {isClamped && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-indigo-600 hover:underline font-semibold text-sm mt-1 cursor-pointer"
            >
              Show Less
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CardBody;
