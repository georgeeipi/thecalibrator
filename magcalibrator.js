"use strict";
/*
 * Magnetic-Field Calibrator and ARPANSA Limit Calculator
 *
 * Copyright (c) 2026 George Galanis
 * Licensed under the MIT License.
 * See LICENSE in the project root.
 */


/**********************************************************************************************/
/***************************************** ARPANSA LIMIT CALCULATIONS *************************/
/**********************************************************************************************/
// ============================================================================
// ARPANSA RPS S-1 — REGULATORY LIMITS
//
// All regulatory constants and their calculation functions are defined here.
// If the exposure standard changes, review this section.
// The calculator code below does not contain regulatory limit values.
// ============================================================================
// ARPANSA Table 7 — spatial and temporal peak H-field limits (A/m)
const ARPANSA_PUBLIC_PEAK = 21;
const ARPANSA_OCC_PEAK = 80;
const ARPANSA_PEAK_MAX_FREQUENCY_MHZ = 10;

// ARPANSA RPS S-1, Tables 4 and 5
// Frequencies in MHz; magnetic-field limits in A/m.

const ARPANSA_PUBLIC_WHOLE = 2.2;
const ARPANSA_PUBLIC_LOCAL = 4.9;
const ARPANSA_OCC_WHOLE = 4.9;
const ARPANSA_OCC_LOCAL = 10.8;

const ARPANSA_PUBLIC_LOCAL_THRESHOLD = 0.233;
const ARPANSA_OCC_LOCAL_THRESHOLD = 0.135;


function ARPANSA_public_whole(fMHz) {
    return ARPANSA_PUBLIC_WHOLE / fMHz;
}

function ARPANSA_public_local(fMHz) {

    // Table 5 specifies ES below this frequency.
    if (fMHz <= ARPANSA_PUBLIC_LOCAL_THRESHOLD) {
        return ARPANSA_PUBLIC_PEAK;
    }

    const H_table5 = ARPANSA_PUBLIC_LOCAL / fMHz;

    // Table 7 also applies up to 10 MHz.
    if (fMHz <= ARPANSA_PEAK_MAX_FREQUENCY_MHZ && H_table5 > ARPANSA_PUBLIC_PEAK) {
        return ARPANSA_PUBLIC_PEAK;
    }

    return H_table5;
}

function ARPANSA_occ_whole(fMHz) {
    return ARPANSA_OCC_WHOLE / fMHz;
}

function ARPANSA_occ_local(fMHz) {

    // Table 5 specifies ES below this frequency.
    if (fMHz <= ARPANSA_OCC_LOCAL_THRESHOLD) {
        return ARPANSA_OCC_PEAK;
    }

    const H_table5 = ARPANSA_OCC_LOCAL / fMHz;

    // Table 7 also applies up to 10 MHz.
    if (fMHz <= ARPANSA_PEAK_MAX_FREQUENCY_MHZ && H_table5 > ARPANSA_OCC_PEAK) {
        return ARPANSA_OCC_PEAK;
    }

    return H_table5;
}

/**********************************************************************************************/
/**********************************************************************************************/
/**********************************************************************************************/


// MAGNETIC-FIELD CALIBRATOR
//
// 1. Mathematical equations
// 2. Read inputs
// 3. Calculate results
// 4. Display results
// 5. Initialise the webpage
//
// The calculation functions do not read or write anything on the webpage.


// 1. MATHEMATICAL EQUATIONS

// I_cal = V_R3,RMS / R3
function calculateCalibrationCurrent(voltageRms, resistanceOhms) {
    return voltageRms / resistanceOhms;
}

// H_cal = a^2 * I_cal / [2 * (a^2 + z^2)^(3/2)]
function calculateCalibrationMagneticField(radiusMetres, distanceMetres, currentAmps) {
    const radiusSquared = radiusMetres * radiusMetres;
    const distanceSquared = distanceMetres * distanceMetres;
    return radiusSquared * currentAmps /
           (2 * Math.pow(radiusSquared + distanceSquared, 1.5));
}

// cal = 20 * log10(H_cal) - P_cal,dBm
function calculateCalibrationConstant(magneticFieldAmpsPerMetre, analyserPowerDbm) {
    return 20 * Math.log10(magneticFieldAmpsPerMetre) - analyserPowerDbm;
}

// P_lim,dBm = 20 * log10(H_lim) - cal
function PlimdBm(H_lim, cal) {
    return 20 * Math.log10(H_lim) - cal;
}



function formatNumber(value) {
    return value.toLocaleString("en-AU", { maximumSignificantDigits: 7, useGrouping: false });
}

function formatPower(value) {
    return value.toFixed(1) + " dBm";
}



function displayCalibrationCurrent(V_R3_RMS, R3, I_cal) {
    document.getElementById("currentVoltage").textContent = V_R3_RMS;
    document.getElementById("currentResistance").textContent = R3;
    document.getElementById("currentAnswer").textContent = I_cal.toFixed(6) + " A";
}


function displayCalibrationMagneticField(a, z, I_cal, H_cal) {
    document.getElementById("fieldRadiusNumerator").textContent = a;
    document.getElementById("fieldRadiusDenominator").textContent = a;
    document.getElementById("fieldDistance").textContent = z;
    document.getElementById("fieldCurrent").textContent = I_cal.toFixed(6);
    document.getElementById("fieldAnswer").textContent = H_cal.toFixed(6) + " A/m";
}


function displayCalibrationConstant(H_cal, P_cal_dBm, cal) {
    document.getElementById("calField").textContent = formatNumber(H_cal);
    document.getElementById("calPower").textContent = P_cal_dBm;
    document.getElementById("calAnswer").textContent = cal.toFixed(4) + " dB";
}




function displayHlimit(id, H_lim) {
    document.getElementById("derived-" + id).textContent = H_lim.toFixed(4) + " A/m";
}


function displayPlimdBm(id, H_lim, P_limdBm, cal) {

    document.getElementById("limit-" + id + "-fieldInEquation").textContent =
        formatNumber(H_lim.toFixed(4));

    document.getElementById("limit-" + id + "-constant").textContent =
        formatNumber(cal.toFixed(4));

    document.getElementById("limit-" + id + "-power").textContent =
        formatPower(P_limdBm);
}



function readCalibratorDesign() {
    const a = Number(document.getElementById("a").value)/1000;
    const R3 = Number(document.getElementById("r3").value);

    return { a, R3 };
}

function readCalibrationMeasurements() {
    const z = Number(document.getElementById("z").value)/1000;
    const V_R3_RMS = Number(document.getElementById("v").value);
    const P_cal_dBm = Number(document.getElementById("pcal").value);

    return { z, V_R3_RMS, P_cal_dBm };
}




let cal;

function updateCalibration() {

    const { a, R3 } = readCalibratorDesign();
    const { z, V_R3_RMS, P_cal_dBm } = readCalibrationMeasurements();

    const I_cal = calculateCalibrationCurrent(V_R3_RMS, R3);
    displayCalibrationCurrent(V_R3_RMS, R3, I_cal);

    const H_cal = calculateCalibrationMagneticField(a, z, I_cal);
    displayCalibrationMagneticField(a, z, I_cal, H_cal);

    cal = calculateCalibrationConstant(H_cal, P_cal_dBm);
    displayCalibrationConstant(H_cal, P_cal_dBm, cal);

    updateLimits();
}




function updateLimits() {
    const f = Number(document.getElementById("frequency").value);

    const H_lim_public_whole = ARPANSA_public_whole(f);
    const H_lim_public_local = ARPANSA_public_local(f);
    const H_lim_occ_whole = ARPANSA_occ_whole(f);
    const H_lim_occ_local = ARPANSA_occ_local(f);

    displayHlimit("hpublicWhole", H_lim_public_whole);
    displayHlimit("hpublicLocal", H_lim_public_local);
    displayHlimit("hoccupWhole", H_lim_occ_whole);
    displayHlimit("hoccupLocal", H_lim_occ_local);


    const P_limdBm_public_whole = PlimdBm(H_lim_public_whole, cal);
    const P_limdBm_public_local = PlimdBm(H_lim_public_local, cal);
    const P_limdBm_occ_whole = PlimdBm(H_lim_occ_whole, cal);
    const P_limdBm_occ_local = PlimdBm(H_lim_occ_local, cal);

    displayPlimdBm("hpublicWhole", H_lim_public_whole, P_limdBm_public_whole, cal);
    displayPlimdBm("hpublicLocal", H_lim_public_local, P_limdBm_public_local, cal);
    displayPlimdBm("hoccupWhole", H_lim_occ_whole, P_limdBm_occ_whole, cal);
    displayPlimdBm("hoccupLocal", H_lim_occ_local, P_limdBm_occ_local, cal);

    writeCalculatorInputs();
}


//*********************************** FILE MANAGMENT ***************************************/
function writeCalculatorInputs() {
    localStorage.setItem("magcalibrator.a", Number(document.getElementById("a").value) / 1000.0);
    localStorage.setItem("magcalibrator.R3", document.getElementById("r3").value);
    localStorage.setItem("magcalibrator.z", Number(document.getElementById("z").value) / 1000.0);
    localStorage.setItem("magcalibrator.V_R3_RMS", document.getElementById("v").value);
    localStorage.setItem("magcalibrator.P_cal_dBm", document.getElementById("pcal").value);
    localStorage.setItem("magcalibrator.f", document.getElementById("frequency").value);
}

function readCalculatorInputs() {
    document.getElementById("a").value = localStorage.getItem("magcalibrator.a")*1000.0;
    document.getElementById("r3").value = localStorage.getItem("magcalibrator.R3");
    document.getElementById("z").value = localStorage.getItem("magcalibrator.z")*1000.0;
    document.getElementById("v").value = localStorage.getItem("magcalibrator.V_R3_RMS");
    document.getElementById("pcal").value = localStorage.getItem("magcalibrator.P_cal_dBm");
    document.getElementById("frequency").value = localStorage.getItem("magcalibrator.f");
}

function initialiseCalculatorInputs() {
    if (localStorage.getItem("magcalibrator.a") === null) {
        setArticleInputs();
        writeCalculatorInputs();
    } else {
        readCalculatorInputs();
    }
}

//******************************************************************************************/


function setArticleInputs() {
    document.getElementById("a").value = 47.0233;
    document.getElementById("r3").value = 50.4;
    document.getElementById("z").value = 300.0;
    document.getElementById("v").value = 0.835;
    document.getElementById("pcal").value = -86.3;
    document.getElementById("frequency").value = 3.6;
}

function resetCalculator() {
    setArticleInputs();
    updateCalibration();
}

function initialiseListeners() {
    document.getElementById("a").addEventListener("input", updateCalibration);
    document.getElementById("r3").addEventListener("input", updateCalibration);
    document.getElementById("z").addEventListener("input", updateCalibration);
    document.getElementById("v").addEventListener("input", updateCalibration);
    document.getElementById("pcal").addEventListener("input", updateCalibration);
    document.getElementById("frequency").addEventListener("input", updateLimits);
    document.getElementById("resetButton").addEventListener("click", resetCalculator);
}

function initialiseCalculator() {
    initialiseListeners();
    initialiseCalculatorInputs();
    updateCalibration();
}

initialiseCalculator();
