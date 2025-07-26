import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Answer({ ans }) {
  // If line starts with ###, render as h3
  if (/^#{3}\s/.test(ans)) {
    return <h3 className="text-lg font-bold py-2">{ans.replace(/^#{3}\s/, '')}</h3>;
  }

  // If contains LaTeX inside $...$, render those parts with KaTeX
  const renderWithMath = (text) => {
    const parts = text.split(/(\$.*?\$)/); // Split around $...$
    return parts.map((part, index) => {
      if (/^\$(.*?)\$/.test(part)) {
        const expr = part.replace(/^\$(.*?)\$/, '$1');
        return <InlineMath key={index} math={expr} />;
      }
      return renderWithBoldAndCode(part, index);
    });
  };

  // Handles **bold** and `inline code`
  const renderWithBoldAndCode = (text, keyPrefix = 0) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/);
    return parts.map((part, i) => {
      const key = `${keyPrefix}-${i}`;
      if (/^\*\*(.*?)\*\*$/.test(part)) {
        return <strong key={key}>{part.replace(/^\*\*(.*?)\*\*$/, '$1')}</strong>;
      } else if (/^`.*?`$/.test(part)) {
        return (
          <code key={key} className="bg-zinc-800 px-1 rounded text-sm text-green-300">
            {part.replace(/^`(.*?)`$/, '$1')}
          </code>
        );
      } else {
        return <span key={key}>{part}</span>;
      }
    });
  };

  return <div className="py-2 leading-relaxed">{renderWithMath(ans)}</div>;
}
