"use strict";
/*
 * Copyright (c) 2026 George Galanis
 * Licensed under the MIT License.
 * See LICENSE in the project root.
 */

// cal = P_cal,dBm - 20 * log10(field_cal)
function calculateCalibrationConstant(calibrationField, analyserPowerDbm) {
    return analyserPowerDbm - 20 * Math.log10(calibrationField);
}

// P_lim,dBm = 20 * log10(field_lim) + cal
function PlimdBm(fieldLimit, cal) {
    return 20 * Math.log10(fieldLimit) + cal;
}

function formatNumber(value) {
    return value.toLocaleString("en-AU", { maximumSignificantDigits: 7, useGrouping: false });
}

function formatPower(value) {
    return value.toFixed(1) + " dBm";
}

// Step by the last decimal place currently displayed in the input.
function stepCalculatorInput(input, direction) {
    const inputValue = input.value;
    if (inputValue !== "") {
        const parts = inputValue.toLowerCase().split("e");
        const decimalParts = parts[0].split(".");
        let decimalPlaces = 0;
        let exponent = 0;
        if (decimalParts.length > 1) {
            decimalPlaces = decimalParts[1].length;
        }
        if (parts.length > 1) {
            exponent = Number(parts[1]);
        }
        const stepExponent = exponent - decimalPlaces;
        let outputPlaces = -stepExponent;
        if (outputPlaces < 0) {
            outputPlaces = 0;
        }
        const nextValue = Number((Number(inputValue) + direction * Math.pow(10, stepExponent)).toFixed(Math.min(outputPlaces, 100)));
        const minAllowed = input.min === "" || nextValue >= Number(input.min);
        const maxAllowed = input.max === "" || nextValue <= Number(input.max);
        if (minAllowed && maxAllowed) {
            input.value = nextValue.toFixed(Math.min(outputPlaces, 100));
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }
}

function stepCalculatorButton(event) {
    const button = event.currentTarget;
    const input = document.getElementById(button.dataset.input);
    stepCalculatorInput(input, Number(button.dataset.direction));
}

function stepCalculatorKey(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        if (event.key === "ArrowUp") {
            stepCalculatorInput(event.currentTarget, 1);
        } else {
            stepCalculatorInput(event.currentTarget, -1);
        }
    }
}

function initialiseCalculatorSteppers() {
    const inputs = document.querySelectorAll('input[type="number"]');
    for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];
        const controls = document.createElement("span");
        const upButton = document.createElement("button");
        const downButton = document.createElement("button");
        const label = document.querySelector('label[for="' + input.id + '"]').textContent.trim();

        controls.className = "number-stepper";
        upButton.type = "button";
        upButton.textContent = "▲";
        upButton.setAttribute("aria-label", "Increase " + label);
        upButton.dataset.input = input.id;
        upButton.dataset.direction = "1";
        upButton.addEventListener("click", stepCalculatorButton);
        downButton.type = "button";
        downButton.textContent = "▼";
        downButton.setAttribute("aria-label", "Decrease " + label);
        downButton.dataset.input = input.id;
        downButton.dataset.direction = "-1";
        downButton.addEventListener("click", stepCalculatorButton);
        controls.appendChild(upButton);
        controls.appendChild(downButton);
        input.insertAdjacentElement("afterend", controls);
        input.addEventListener("keydown", stepCalculatorKey);
    }
}
