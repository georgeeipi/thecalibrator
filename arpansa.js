"use strict";
/*
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
// Table 7: spatial and temporal peak H-field reference levels, in A/m.
// The table applies from 0.1 MHz through 10 MHz, inclusive.
const MAG_ARPANSA_PUBLIC_PEAK = 21;
const MAG_ARPANSA_OCC_PEAK = 80;
const MAG_ARPANSA_PEAK_MAX_FREQUENCY_MHZ = 10;

// Tables 4 and 5: H-field reference levels are the coefficient / fMHz.
// Whole-body coefficients are from Table 4; local coefficients are from Table 5.
const MAG_ARPANSA_PUBLIC_WHOLE = 2.2;
const MAG_ARPANSA_PUBLIC_LOCAL = 4.9;
const MAG_ARPANSA_OCC_WHOLE = 4.9;
const MAG_ARPANSA_OCC_LOCAL = 10.8;

// Table 5: at and below these published MHz boundaries the H-field entry is ES.
// They are approximately where the local coefficient / fMHz meets the
// corresponding Table 7 peak limit; retain the rounded table boundaries.
const MAG_ARPANSA_PUBLIC_LOCAL_THRESHOLD = 0.233;
const MAG_ARPANSA_OCC_LOCAL_THRESHOLD = 0.135;

// Table 7: spatial and temporal peak E-field reference levels, in V/m.
// Its upper frequency boundary is 10 MHz, inclusive.
const ELEC_ARPANSA_PUBLIC_PEAK = 83;
const ELEC_ARPANSA_OCC_PEAK = 170;
const ELEC_ARPANSA_PEAK_MAX_FREQUENCY_MHZ = 10;

// Table 4: whole-body E-field entries are ES at and below these MHz boundaries.
// The published boundaries are approximately where coefficient / fMHz^0.7
// meets the corresponding Table 7 peak; use the table values as stated.
const ELEC_ARPANSA_PUBLIC_WHOLE_THRESHOLD = 6.27;
const ELEC_ARPANSA_OCC_WHOLE_THRESHOLD = 6.943;

// Table 5: both local E-field entries are ES through 10 MHz. This boundary
// happens to match the upper frequency of Table 7; each belongs to its table.
const ELEC_ARPANSA_LOCAL_THRESHOLD = 10;

// Table 4: whole-body E-field reference levels are coefficient / fMHz^0.7.
const ELEC_ARPANSA_PUBLIC_WHOLE = 300;
const ELEC_ARPANSA_OCC_WHOLE = 660;

// Table 5 specifies 671 / fMHz^0.7 for public local exposure
// and 1504 / fMHz^0.7 for occupational local exposure.
const ELEC_ARPANSA_PUBLIC_LOCAL = 671;
const ELEC_ARPANSA_OCC_LOCAL = 1504;

// The exponent 0.7 is specified in both Tables 4 and 5 for these E-field equations.
const ELEC_ARPANSA_FREQUENCY_EXPONENT = 0.7;


function MAG_ARPANSA_public_whole(fMHz) {
    return MAG_ARPANSA_PUBLIC_WHOLE / fMHz;
}

function MAG_ARPANSA_public_local(fMHz) {

    // Table 5 specifies ES below this frequency.
    if (fMHz <= MAG_ARPANSA_PUBLIC_LOCAL_THRESHOLD) {
        return MAG_ARPANSA_PUBLIC_PEAK;
    }

    const H_table5 = MAG_ARPANSA_PUBLIC_LOCAL / fMHz;

    // Table 7 also applies up to 10 MHz.
    if (fMHz <= MAG_ARPANSA_PEAK_MAX_FREQUENCY_MHZ && H_table5 > MAG_ARPANSA_PUBLIC_PEAK) {
        return MAG_ARPANSA_PUBLIC_PEAK;
    }

    return H_table5;
}

function MAG_ARPANSA_occ_whole(fMHz) {
    return MAG_ARPANSA_OCC_WHOLE / fMHz;
}

function MAG_ARPANSA_occ_local(fMHz) {

    // Table 5 specifies ES below this frequency.
    if (fMHz <= MAG_ARPANSA_OCC_LOCAL_THRESHOLD) {
        return MAG_ARPANSA_OCC_PEAK;
    }

    const H_table5 = MAG_ARPANSA_OCC_LOCAL / fMHz;

    // Table 7 also applies up to 10 MHz.
    if (fMHz <= MAG_ARPANSA_PEAK_MAX_FREQUENCY_MHZ && H_table5 > MAG_ARPANSA_OCC_PEAK) {
        return MAG_ARPANSA_OCC_PEAK;
    }

    return H_table5;
}


/**********************************************************************************************/
/************************************* Electric Field *****************************************/
/**********************************************************************************************/

// Tables 4 and 5: null indicates ES, with Table 7 provided separately.
function ELEC_ARPANSA_public_whole(fMHz) {
    let electricField = null;
    if (fMHz > ELEC_ARPANSA_PUBLIC_WHOLE_THRESHOLD) {
        electricField = ELEC_ARPANSA_PUBLIC_WHOLE / Math.pow(fMHz, ELEC_ARPANSA_FREQUENCY_EXPONENT);
    }
    return electricField;
}

function ELEC_ARPANSA_occ_whole(fMHz) {
    let electricField = null;
    if (fMHz > ELEC_ARPANSA_OCC_WHOLE_THRESHOLD) {
        electricField = ELEC_ARPANSA_OCC_WHOLE / Math.pow(fMHz, ELEC_ARPANSA_FREQUENCY_EXPONENT);
    }
    return electricField;
}

function ELEC_ARPANSA_public_local(fMHz) {
    let electricField = null;
    if (fMHz > ELEC_ARPANSA_LOCAL_THRESHOLD) {
        electricField = ELEC_ARPANSA_PUBLIC_LOCAL / Math.pow(fMHz, ELEC_ARPANSA_FREQUENCY_EXPONENT);
    }
    return electricField;
}

function ELEC_ARPANSA_occ_local(fMHz) {
    let electricField = null;
    if (fMHz > ELEC_ARPANSA_LOCAL_THRESHOLD) {
        electricField = ELEC_ARPANSA_OCC_LOCAL / Math.pow(fMHz, ELEC_ARPANSA_FREQUENCY_EXPONENT);
    }
    return electricField;
}

// Table 7: instantaneous spatial peak limits apply through 10 MHz.
function ELEC_ARPANSA_public_peak(fMHz) {
    let electricField = null;
    if (fMHz <= ELEC_ARPANSA_PEAK_MAX_FREQUENCY_MHZ) {
        electricField = ELEC_ARPANSA_PUBLIC_PEAK;
    }
    return electricField;
}

function ELEC_ARPANSA_occ_peak(fMHz) {
    let electricField = null;
    if (fMHz <= ELEC_ARPANSA_PEAK_MAX_FREQUENCY_MHZ) {
        electricField = ELEC_ARPANSA_OCC_PEAK;
    }
    return electricField;
}

/**********************************************************************************************/
/**********************************************************************************************/
/**********************************************************************************************/


