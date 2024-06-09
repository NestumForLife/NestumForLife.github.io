
// Get references to the calculator elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.number');

// Initialize the calculator state
let currentNumber = '';
let previousNumber = '';
let operation = null;
let operationHistory = [];
let operationCompleted = false;

// Function to update the display
function updateDisplay() {
    display.value = currentNumber;
    document.getElementById('history').value = operationHistory.join('\n');
}

// Function to write the history
function writeHistory() {
    const history = document.getElementById('history');
    history.innerHTML = '';
    operationHistory.forEach(calculation => {
        const p = document.createElement('p');
        p.textContent = calculation;
        history.appendChild(p);
    });
}

// Function to handle number button clicks
function handleNumberClick(number) {
    if (operationCompleted) {
        currentNumber = '';
        operationCompleted = false;
    }
    currentNumber += number;
    updateDisplay();
}

// Function to handle operation button clicks
function handleOperationClick(op) {
    if (currentNumber === '') return;

    if (previousNumber !== '') {
        calculate();
    }

    operation = op;
    previousNumber = currentNumber;
    currentNumber = '';
}

function clear(){
    currentNumber = '';
    previousNumber = '';
    operation = null;
    updateDisplay();
}

// Funtions to perform the operations
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        alert('You cannot divide by zero');
        clear();
        return;
    }
    return a / b;
}

// Function to perform the calculation
function calculate() {
    const num1 = parseFloat(previousNumber);
    const num2 = parseFloat(currentNumber);

    if (isNaN(num1) || isNaN(num2)) return;

    let result;
    switch (operation) {
        case '+':
            result = add(num1, num2);
            break;
        case '-':
            result = subtract(num1, num2);
            break;
        case '*':
            result = multiply(num1, num2);
            break;
        case '/':
            result = divide(num1, num2);
            break;
        default:
            return;
    }

    // Add the calculation to the history
    operationHistory.push(`${num1} ${operation} ${num2} = ${result}`);

    currentNumber = result.toString();
    previousNumber = '';
    operation = null;
    operationCompleted = true;

    updateDisplay();
    writeHistory();
}

// Add event listeners to the number buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        handleNumberClick(button.value);
    });
});

// Add event listeners to the operation buttons
document.getElementById('add').addEventListener('click', () => {
    handleOperationClick('+');
});

document.getElementById('subtract').addEventListener('click', () => {
    handleOperationClick('-');
});

document.getElementById('multiply').addEventListener('click', () => {
    handleOperationClick('*');
});

document.getElementById('divide').addEventListener('click', () => {
    handleOperationClick('/');
});

document.getElementById('clear').addEventListener('click', () => {
    clear();
});

// Add event listener to the equal button
document.getElementById('equal').addEventListener('click', calculate);