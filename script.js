
// Helper function to get the radix (base) for parseInt

function getRadix(baseString) {
    switch (baseString) {
        case 'bin': return 2;
        case 'oct': return 8;
        case 'dec': return 10;
        case 'hex': return 16;
        default: return 10; // Default to decimal if somehow invalid
    }
}

// Helper function to validate input against a base's character set
function isValidInput(value, base) {
    const validBinary = /^[01]+$/;
    const validOctal = /^[0-7]+$/;
    const validDecimal = /^\d+$/;
    const validHexadecimal = /^[0-9A-Fa-f]+$/;

    switch (base) {
        case 'bin': return validBinary.test(value);
        case 'oct': return validOctal.test(value);
        case 'dec': return validDecimal.test(value);
        case 'hex': return validHexadecimal.test(value);
        default: return false; // Should not happen
    }
}


// --- Number Base Converter Logic ---
function convert() {
    const valueInput = document.getElementById('value').value.trim();
    const fromBase = document.getElementById('from').value;
    const outputDiv = document.getElementById('output');
    const resultImage = document.getElementById('converter-result-image'); // Get the image element

    // Hide image by default for new conversion
    if (resultImage) {
        resultImage.style.display = 'none';
        
    }

    if (valueInput === '') {
        outputDiv.innerHTML = '<span class="error">Please enter a number to convert.</span>';
        return;
    }
    

    // Validate input format first
    if (!isValidInput(valueInput, fromBase)) {
        let baseName = '';
        switch(fromBase) {
            case 'bin': baseName = 'Binary'; break;
            case 'oct': baseName = 'Octal'; break;
            case 'dec': baseName = 'Decimal'; break;
            case 'hex': baseName = 'Hexadecimal'; break;
        }
        outputDiv.innerHTML = `<span class="error">Invalid characters for ${baseName} input.</span>`;
        return;
    }

    let decimalValue;
    try {
        decimalValue = parseInt(valueInput, getRadix(fromBase));

        // This check catches numbers that might be too large for parseInt or other edge cases
        if (isNaN(decimalValue)) {
            outputDiv.innerHTML = `<span class="error">Could not parse "${valueInput}" as a valid ${fromBase} number.</span>`;
            return;
        }

        const bin = decimalValue.toString(2);
        const oct = decimalValue.toString(8);
        const dec = decimalValue.toString(10);
        const hex = decimalValue.toString(16).toUpperCase();

        outputDiv.innerHTML = `
            ${resultImage ? '<img src="https://i.ibb.co/L9hV1j1/calculator-removebg-preview.png" alt="Result Icon" class="result-image" style="display: block;">' : ''}
            <div>
                <strong>Binary:</strong> ${bin}<br>
                <strong>Octal:</strong> ${oct}<br>
                <strong>Decimal:</strong> ${dec}<br>
                <strong>Hexadecimal:</strong> ${hex}
            </div>
        `;

        // If the image was created dynamically above, this line isn't strictly needed,
        // but it's good for robustness if the image is static in HTML but hidden by CSS.
        if (resultImage) {
             resultImage.style.display = 'block';
        }

    } catch (e) {
        outputDiv.innerHTML = `<span class="error">An unexpected error occurred during conversion: ${e.message}</span>`;
        console.error("Conversion error:", e);
    }
}


// --- Number Base Calculator Logic ---
function calculate() {
    const num1Input = document.getElementById('num1').value.trim();
    const base1 = document.getElementById('base1').value;
    const operation = document.getElementById('operation').value;
    const num2Input = document.getElementById('num2').value.trim();
    const base2 = document.getElementById('base2').value;
    const calculatorOutputDiv = document.getElementById('calculator-output');
    const resultImage = document.getElementById('calculator-result-image'); // Get the image element

    // Hide image by default for new calculation
    if (resultImage) {
        resultImage.style.display = 'none';
    }

    if (num1Input === '' || num2Input === '') {
        calculatorOutputDiv.innerHTML = '<span class="error">Please enter both numbers for calculation.</span>';
        return;
    }

    // Validate input format for num1
    if (!isValidInput(num1Input, base1)) {
        let baseName = '';
        switch(base1) {
            case 'bin': baseName = 'Binary'; break;
            case 'oct': baseName = 'Octal'; break;
            case 'dec': baseName = 'Decimal'; break;
            case 'hex': baseName = 'Hexadecimal'; break;
        }
        calculatorOutputDiv.innerHTML = `<span class="error">Invalid characters for first number (${baseName} input).</span>`;
        return;
    }

    // Validate input format for num2
    if (!isValidInput(num2Input, base2)) {
        let baseName = '';
        switch(base2) {
            case 'bin': baseName = 'Binary'; break;
            case 'oct': baseName = 'Octal'; break;
            case 'dec': baseName = 'Decimal'; break;
            case 'hex': baseName = 'Hexadecimal'; break;
        }
        calculatorOutputDiv.innerHTML = `<span class="error">Invalid characters for second number (${baseName} input).</span>`;
        return;
    }

    let decNum1;
    let decNum2;

    try {
        // Convert num1 to decimal
        decNum1 = parseInt(num1Input, getRadix(base1));
        if (isNaN(decNum1)) {
            calculatorOutputDiv.innerHTML = `<span class="error">Could not parse "${num1Input}" as a valid ${base1} number.</span>`;
            return;
        }

        // Convert num2 to decimal
        decNum2 = parseInt(num2Input, getRadix(base2));
        if (isNaN(decNum2)) {
            calculatorOutputDiv.innerHTML = `<span class="error">Could not parse "${num2Input}" as a valid ${base2} number.</span>`;
            return;
        }

        let resultDecimal;
        switch (operation) {
            case 'add':
                resultDecimal = decNum1 + decNum2;
                break;
            case 'subtract':
                resultDecimal = decNum1 - decNum2;
                break;
            case 'multiply':
                resultDecimal = decNum1 * decNum2;
                break;
            case 'divide':
                if (decNum2 === 0) {
                    calculatorOutputDiv.innerHTML = '<span class="error">Division by zero is not allowed.</span>';
                    return;
                }
                resultDecimal = decNum1 / decNum2;
                // For division, decide on rounding or precision.
                // For now, let's round to a reasonable number of decimal places for display.
                resultDecimal = parseFloat(resultDecimal.toFixed(6)); // Round to 6 decimal places
                break;
            default:
                calculatorOutputDiv.innerHTML = '<span class="error">Invalid operation selected.</span>';
                return;
        }

        // Display results in all bases
        // Handle potential non-integer results from division for other bases
        const resultBin = Number.isInteger(resultDecimal) ? resultDecimal.toString(2) : `Not integer: ${resultDecimal.toString(2)}`;
        const resultOct = Number.isInteger(resultDecimal) ? resultDecimal.toString(8) : `Not integer: ${resultDecimal.toString(8)}`;
        const resultDec = resultDecimal.toString(10); // Decimal is always fine
        const resultHex = Number.isInteger(resultDecimal) ? resultDecimal.toString(16).toUpperCase() : `Not integer: ${resultDecimal.toString(16).toUpperCase()}`;


        calculatorOutputDiv.innerHTML = `
            ${resultImage ? '<img src="https://i.ibb.co/L9hV1j1/calculator-removebg-preview.png" alt="Result Icon" class="result-image" style="display: block;">' : ''}
            <div>
                <strong>Result:</strong><br>
                Binary: ${resultBin}<br>
                Octal: ${resultOct}<br>
                Decimal: ${resultDec}<br>
                Hexadecimal: ${resultHex}
            </div>
        `;

        if (resultImage) {
            resultImage.style.display = 'block';
        }

    } catch (e) {
        calculatorOutputDiv.innerHTML = `<span class="error">An unexpected error occurred during calculation: ${e.message}</span>`;
        console.error("Calculation error:", e);
    }
}

// Ensure the HTML has the image elements with the correct IDs:
// For converter: <img id="converter-result-image" src="path/to/your/image.png" alt="Result Icon" class="result-image">
// For calculator: <img id="calculator-result-image" src="path/to/your/image.png" alt="Result Icon" class="result-image">
// Place these inside their respective .result divs.alert('Conversion successful!');
