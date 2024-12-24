'use client';

import {useState} from 'react';

const COMMON_BUTTON_STYLES = 'bg-gray-300 hover:bg-gray-400';
const FUNCTION_BUTTON_STYLES = 'bg-gray-200 hover:bg-gray-300';
const OPERATION_BUTTON_STYLES = 'bg-orange-500 text-white hover:bg-orange-600';
const ZERO_BUTTON_STYLES = 'col-span-2 bg-gray-300 hover:bg-gray-400';

export default function Home() {
  const [currentValue, setCurrentValue] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNextValue, setWaitingForNextValue] = useState(false);

  const calculatorKeys = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const getButtonClass = (label) => {
    if (["C", "±", "%"].includes(label)) return FUNCTION_BUTTON_STYLES;
    if (["÷", "×", "−", "+", "="].includes(label)) return OPERATION_BUTTON_STYLES;
    if (label === "0") return ZERO_BUTTON_STYLES;
    return COMMON_BUTTON_STYLES;
  };

  const handleButtonClick = (label) => {
    if (["÷", "×", "−", "+"].includes(label)) {
      handleOperator(label);
    } else if (label === "=") {
      handleEquals();
    } else if (label === "C") {
      clearCalculator();
    } else if (label === "±") {
      toggleSign();
    } else if (label === "%") {
      handlePercentage();
    } else {
      handleNumberInput(label);
    }
  };

  const handleNumberInput = (input) => {
    if (waitingForNextValue) {
      setCurrentValue(input);
      setWaitingForNextValue(false);
    } else {
      setCurrentValue((prev) => (prev === "0" ? input : prev + input));
    }
  };

  const handleOperator = (nextOperator) => {
    if (operator && waitingForNextValue) {
      setOperator(nextOperator);
      return;
    }
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operator) {
      const result = calculate(previousValue, currentValue, operator);
      setPreviousValue(result.toString());
      setCurrentValue(result.toString());
    }
    setOperator(nextOperator);
    setWaitingForNextValue(true);
  };

  const handleEquals = () => {
    if (!operator || previousValue === null) return;
    const result = calculate(previousValue, currentValue, operator);
    setCurrentValue(result.toString());
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNextValue(true);
  };

  const clearCalculator = () => {
    setCurrentValue("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNextValue(false);
  };

  const toggleSign = () => {
    setCurrentValue((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
  };

  const handlePercentage = () => {
    setCurrentValue((prev) => (parseFloat(prev) / 100).toString());
  };

  const calculate = (firstValue, secondValue, operator) => {
    const num1 = parseFloat(firstValue);
    const num2 = parseFloat(secondValue);
    if (operator === "÷") return num1 / num2;
    if (operator === "×") return num1 * num2;
    if (operator === "−") return num1 - num2;
    if (operator === "+") return num1 + num2;
    return secondValue;
  };

  const renderDisplay = () => (
      <div className="text-right mb-24 mt-24 text-4xl font-semibold bg-gray-100 rounded py-3 px-4 shadow">
        {currentValue}
      </div>
  );

  const renderButton = (label, key) => (
      <button
          key={key}
          className={`py-2 rounded-lg text-xl font-semibold shadow active:scale-95 transition-transform duration-150 outline-none focus:ring-2 focus:ring-offset-2 ${getButtonClass(label)}`}
          onClick={() => handleButtonClick(label)}
      >
        {label}
      </button>
  );

  const renderRow = (row, rowIndex) =>
      row.map((label, colIndex) => renderButton(label, `${rowIndex}-${colIndex}`));

  const renderButtons = () => (
      <div className="grid grid-cols-4 gap-3 flex-grow">
        {calculatorKeys.map(renderRow)}
      </div>
  );

  return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
        <div className="mockup-phone shadow-2xl">
          <div className="camera bg-gray-700"></div>
          <div className="display bg-black">
            <div className="artboard artboard-demo phone-4">
              <div className="rounded-lg shadow-lg w-full h-full flex flex-col justify-between p-5">
                {renderDisplay()}
                {renderButtons()}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}