(function () {
  "use strict";

  const displayEl = document.getElementById("display");
  const keysContainer = document.querySelector(".keys");

  /**
   * Internal calculator state
   */
  let currentInput = "0";       // what user is typing
  let storedValue = null;        // previous value before operator
  let activeOperator = null;     // '+', '-', '*', '/'
  let shouldResetInput = false;  // whether next digit should start new number

  function updateDisplay(value) {
    displayEl.textContent = value;
  }

  function handleDigit(d) {
    if (shouldResetInput) {
      currentInput = d;
      shouldResetInput = false;
    } else {
      if (currentInput === "0") currentInput = d;
      else currentInput += d;
    }
    updateDisplay(currentInput);
  }

  function handleDecimal() {
    if (shouldResetInput) {
      currentInput = "0.";
      shouldResetInput = false;
    } else if (!currentInput.includes(".")) {
      currentInput += ".";
    }
    updateDisplay(currentInput);
  }

  function clearAll() {
    currentInput = "0";
    storedValue = null;
    activeOperator = null;
    shouldResetInput = false;
    updateDisplay(currentInput);
  }

  function deleteOne() {
    if (shouldResetInput) return; // nothing to delete
    if (currentInput.length <= 1) currentInput = "0";
    else currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
  }

  function performOperation(op, a, b) {
    switch (op) {
      case "+":
        return a + b;
      case "/":
        return a / b;
        
      case "*":
        return a * b;
      case "-":
        return a - b;
      default:
        return b;
    }
    
  }

  function setOperator(op) {
    const inputValue = Number(currentInput);
    if (storedValue === null) {
      storedValue = inputValue;
    } else if (!shouldResetInput && activeOperator) {
      storedValue = performOperation(activeOperator, storedValue, inputValue);
      updateDisplay(Number.isNaN(storedValue) ? "Error" : String(storedValue));
    }
    activeOperator = op;
    shouldResetInput = true;
  }

  function equals() {
    if (activeOperator === null || storedValue === null) return;
    const inputValue = Number(currentInput);
    const result = performOperation(activeOperator, storedValue, inputValue);
    currentInput = Number.isNaN(result) ? "Error" : String(result);
    storedValue = null;
    activeOperator = null;
    shouldResetInput = true;
    updateDisplay(currentInput);
  }

  // Event delegation: listen on the container and handle clicks for all buttons
  keysContainer.addEventListener("click", function (event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("btn")) return;

    const digit = target.getAttribute("data-digit");
    const operator = target.getAttribute("data-operator");
    const decimal = target.getAttribute("data-decimal");
    const action = target.getAttribute("data-action");

    if (digit) {
      handleDigit(digit);
      return;
    }

    if (decimal) {
      handleDecimal();
      return;
    }

    if (operator) {
      setOperator(operator);
      return;
    }

    if (action === "clear") {
      clearAll();
      return;
    }

    if (action === "delete") {
      deleteOne();
      return;
    }

    if (action === "equals") {
      equals();
      return;
    }
  });

  // Keyboard support (optional extra)
  document.addEventListener("keydown", function (e) {
    const key = e.key;
    if (key >= "0" && key <= "9") handleDigit(key);
    else if (key === ".") handleDecimal();
    else if (key === "+" || key === "-" || key === "*" || key === "/") setOperator(key);
    else if (key === "Enter" || key === "=") equals();
    else if (key === "Backspace") deleteOne();
    else if (key.toLowerCase() === "c") clearAll();
  });

  // Example loop usage: set tabindex for all buttons for accessibility order
  (function assignTabIndex() {
    const buttons = document.querySelectorAll(".keys .btn");
    let tabIndex = 0;
    for (const button of buttons) {
      button.setAttribute("tabindex", String(++tabIndex));
    }
  })();

  // Initialize display
  updateDisplay(currentInput);
})();


