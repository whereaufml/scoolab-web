import React from 'react';

const mathSymbols = ['±', '√', '∫', '∑', 'π', 'θ', 'α', 'β', '²', '³', '°', '∞', '≠', '≤', '≥', '×', '÷', '∆'];

interface MathKeyboardProps {
  onInsert: (symbol: string) => void;
}

const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInsert }) => {
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-xl my-2">
      {mathSymbols.map((sym) => (
        <button
          key={sym}
          type="button"
          onClick={() => onInsert(sym)}
          className="w-8 h-8 flex justify-center items-center bg-white border border-slate-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 font-medium transition-colors shadow-sm"
        >
          {sym}
        </button>
      ))}
    </div>
  );
};

export default MathKeyboard;
