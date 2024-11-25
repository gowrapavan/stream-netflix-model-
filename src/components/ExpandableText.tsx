import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  text: string;
  maxWords?: number;
  className?: string;
}

export default function ExpandableText({ 
  text, 
  maxWords = 40,
  className = ''
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const words = text.split(' ');
  const truncatedText = words.slice(0, maxWords).join(' ');
  const isLongText = words.length > maxWords;

  useEffect(() => {
    if (textRef.current) {
      setShouldShowButton(isLongText);
    }
  }, [text, isLongText]);

  if (!shouldShowButton) {
    return <p className={className}>{text}</p>;
  }

  return (
    <div className={className}>
      <div ref={textRef}>
        {isExpanded ? text : `${truncatedText}...`}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-gray-400 hover:text-white transition-colors mt-2"
      >
        {isExpanded ? (
          <>
            Show Less <ChevronUp className="w-4 h-4 ml-1" />
          </>
        ) : (
          <>
            Show More <ChevronDown className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
    </div>
  );
}