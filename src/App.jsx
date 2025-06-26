import React, { useState, useEffect, useRef } from 'react';
import backscape from './assets/Backspace.png';

const App = () => {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState('');
  const [isFinalAnswer, setIsFinalAnswer] = useState(false);
  const [pressedBtn, setPressedBtn] = useState(null);

  // Обработка процентов
  const handlePercentage = (expression) => {
    return expression.replace(/(\d+)\s*([\+\-\*/])\s*(\d+)%/g, (_, base, operator, percent) => {
      const baseNum = Number(base);
      const percentNum = Number(percent);
      const percentValue = baseNum * (percentNum / 100);

      if (operator === '+') return `${baseNum + percentValue}`;
      if (operator === '-') return `${baseNum - percentValue}`;
      if (operator === '*') return `${baseNum * (percentNum / 100)}`;
      if (operator === '/') return `${baseNum / (percentNum / 100)}`;
      return `${base}${operator}${percentValue}`;
    });
  };

  useEffect(() => {
    const focusInput = () => {
      inputRef.current?.focus();
    };

    focusInput();

    const handleBlur = () => {
      setTimeout(focusInput, 0);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleClick('=');
      } else if (e.key === 'Escape') {
        handleClick('C');
      }
    };

    if (value === '') {
      handleClick('C');
    }

    const input = inputRef.current;
    input?.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      input?.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [value]);

  useEffect(() => {
    try {
      const replaced = handlePercentage(
        value.replace(/÷/g, '/').replace(/×/g, '*')
      );
      const result = eval(replaced);
      if (isFinite(result)) {
        setAnswer(result.toString());
        setIsFinalAnswer(false);
      }
    } catch {
      // не обновляем при ошибке
    }
  }, [value]);

  const buttons = [
    'C', '()', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '+/-', '0', '.', '='
  ];

  function handleClick(btnValue) {
    setPressedBtn(btnValue);
    setTimeout(() => setPressedBtn(null), 100);

    if (btnValue === 'C') {
      setValue('');
      setAnswer('');
      setIsFinalAnswer(false);
    } else if (btnValue == '+/-') {
      setValue(prev => prev.includes('-') ? prev.replace('-', '') : `-${prev}`);
    } else if (btnValue === '=') {
      try {
        const replaced = handlePercentage(
          value.replace(/÷/g, '/').replace(/×/g, '*')
        );
        const result = eval(replaced);
        if (!isFinite(result)) {
          setAnswer('Ошибка');
        } else {
          setAnswer(result.toString());
          setIsFinalAnswer(true);
        }
      } catch {
        setAnswer('Ошибка');
      }
    } else {
      setValue(prev => prev + btnValue);
    }
  }

  const getButtonStyle = (value) => {
    if (value === 'C') return 'bg-[#FF5959] text-[#343434]';
    if (value === '=') return 'bg-[#66FF7F] text-black';
    if (['÷', '×', '-', '+', '%', '()'].includes(value)) return 'text-[#66FF7F]';
    return 'text-white';
  };

  return (
    <div className='bg-[#151515]'>
      <div className='w-[390px] h-[844px] bg-[#151515] rounded-[40px] mx-auto pt-[72px] px-[19px] pb-[42px] font-["Inter"]'>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`
            w-full 
            h-[57px] 
            caret-[#969696] 
            border-none 
            focus:outline-none 
            text-right 
            px-4
            appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none 
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:m-0 
            [&::-webkit-outer-spin-button]:m-0
            ${isFinalAnswer ? 'text-[#969696] text-[38px]' : 'text-white text-[48px]'}
          `}
        />

        <div className={`w-full h-[41px] mt-[88px] flex justify-end items-center ${isFinalAnswer ? 'text-white text-[68px]' : 'text-[#969696] text-[48px]'}`}>
          {answer}
        </div>

        <div className='w-full h-[64px] border-b-1 border-b-[#4E4D4D] flex items-center justify-end'>
          <img
            src={backscape}
            alt="Backspace"
            className='cursor-pointer'
            onClick={() => setValue((prev) => prev.slice(0, -1))}
          />
        </div>

        <div className="w-full grid grid-cols-4 gap-[20px] bg-transparent mt-[25px]">
          {buttons.map((btn, index) => (
            <button
              onClick={() => handleClick(btn)}
              key={index}
              className={`
                cursor-pointer 
                w-[73px] h-[75px] 
                rounded-[9px] 
                text-[36px] 
                bg-[#2B2B2B] 
                ${getButtonStyle(btn)} 
                ${pressedBtn === btn ? 'brightness-125 scale-95' : ''}
                transition duration-100 ease-in-out
              `}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
