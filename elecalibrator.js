"use strict";
/*
 * Copyright (c) 2026 George Galanis
 * Licensed under the MIT License.
 * See LICENSE in the project root.
 */

// Article example: plate separation in mm, RMS voltage in V, power in dBm,
// and frequency in MHz.
const ARTICLE_DISTANCE = 50;
const ARTICLE_VOLTAGE = 4.15;
const ARTICLE_POWER = -50.8;
const ARTICLE_FREQUENCY = 3.6;

function calculateCalibrationElectricField(voltage, distance) {
    return voltage / distance;
}

function displayCalibration(distance, voltage, power, electricField, cal) {
    document.getElementById("fieldVoltage").textContent = voltage;
    document.getElementById("fieldDistance").textContent = distance;
    document.getElementById("fieldAnswer").textContent = formatNumber(electricField) + " V/m";
    document.getElementById("calPower").textContent = power;
    document.getElementById("calField").textContent = formatNumber(electricField);
    document.getElementById("calAnswer").textContent = cal.toFixed(4) + " dB";
}

function displayLimit(id, fieldLimit, unavailable, cal) {
    const fieldOutput = document.getElementById("field-" + id);
    const calculationOutput = document.getElementById("calculation-" + id);
    const powerOutput = document.getElementById("power-" + id);

    if (fieldLimit === null) {
        fieldOutput.textContent = unavailable;
        calculationOutput.textContent = "";
        powerOutput.textContent = unavailable;
    } else {
        fieldOutput.textContent = fieldLimit.toFixed(4) + " V/m";
        calculationOutput.textContent = "20 log10(" + formatNumber(fieldLimit.toFixed(4)) + ") + (" + cal.toFixed(4) + ")";
        powerOutput.textContent = formatPower(PlimdBm(fieldLimit, cal));
    }
}

function displayLimits(frequency, cal) {
    displayLimit("publicWhole", ELEC_ARPANSA_public_whole(frequency), "ES", cal);
    displayLimit("publicLocal", ELEC_ARPANSA_public_local(frequency), "ES", cal);
    displayLimit("publicPeak", ELEC_ARPANSA_public_peak(frequency), "Not applicable", cal);
    displayLimit("occupWhole", ELEC_ARPANSA_occ_whole(frequency), "ES", cal);
    displayLimit("occupLocal", ELEC_ARPANSA_occ_local(frequency), "ES", cal);
    displayLimit("occupPeak", ELEC_ARPANSA_occ_peak(frequency), "Not applicable", cal);
}

function writeCalculatorInputs() {
    localStorage.setItem("elecalibrator.distance", document.getElementById("distance").value);
    localStorage.setItem("elecalibrator.voltage", document.getElementById("voltage").value);
    localStorage.setItem("elecalibrator.power", document.getElementById("pcal").value);
    localStorage.setItem("elecalibrator.frequency", document.getElementById("frequency").value);
}

function readCalculatorInputs() {
    document.getElementById("distance").value = localStorage.getItem("elecalibrator.distance");
    document.getElementById("voltage").value = localStorage.getItem("elecalibrator.voltage");
    document.getElementById("pcal").value = localStorage.getItem("elecalibrator.power");
    document.getElementById("frequency").value = localStorage.getItem("elecalibrator.frequency");
}

function setArticleInputs() {
    document.getElementById("distance").value = ARTICLE_DISTANCE;
    document.getElementById("voltage").value = ARTICLE_VOLTAGE;
    document.getElementById("pcal").value = ARTICLE_POWER;
    document.getElementById("frequency").value = ARTICLE_FREQUENCY;
}

function updateCalculator() {
    const distance = Number(document.getElementById("distance").value) / 1000;
    const voltage = Number(document.getElementById("voltage").value);
    const power = Number(document.getElementById("pcal").value);
    const frequency = Number(document.getElementById("frequency").value);
    const electricField = calculateCalibrationElectricField(voltage, distance);
    const cal = calculateCalibrationConstant(electricField, power);

    displayCalibration(distance, voltage, power, electricField, cal);
    displayLimits(frequency, cal);
    writeCalculatorInputs();
}

function resetCalculator() {
    setArticleInputs();
    updateCalculator();
}

function initialiseCalculator() {
    if (localStorage.getItem("elecalibrator.distance") === null) {
        setArticleInputs();
    } else {
        readCalculatorInputs();
    }

    document.getElementById("distance").addEventListener("input", updateCalculator);
    document.getElementById("voltage").addEventListener("input", updateCalculator);
    document.getElementById("pcal").addEventListener("input", updateCalculator);
    document.getElementById("frequency").addEventListener("input", updateCalculator);
    document.getElementById("resetButton").addEventListener("click", resetCalculator);
    initialiseCalculatorSteppers();
    updateCalculator();
}

initialiseCalculator();
