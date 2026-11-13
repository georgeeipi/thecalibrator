# The Calibrator

The Calibrator provides magnetic-field and electric-field calculators for calibrating probes using 
known fields and spectrum-analyser measurements. 
Each calculator displays the equations and calculates the analyser 
readings corresponding to ARPANSA reference levels.

## Running the calculators

Download the files and keep them together in one folder. 
Serve that folder with a local web server, then open `index.html` in your browser. 
For example, if Python is installed, run the following command in the folder:

```text
python -m http.server 8000
```

Then visit `http://localhost:8000/` and choose a calculator.

## Using the calculators

- 	Enter the calibrator dimensions and your calibration measurements. 
	The pages show the calculation of the field and calibration constant, 
	followed by the corresponding analyser limits.
- 	Enter the measurement frequency in MHz. 
	The ARPANSA calculations cover 100 kHz to 30 MHz.
- 	The initial inputs use examples from the accompanying articles. 
	Select **reset** to restore those inputs.
- 	Inputs are saved in your browser's local storage. 
	The electric and magnetic calculators save their inputs separately.

The electric-field calculation assumes a uniform field between the calibrator plates. 
Consult [ARPANSA RPS S-1](https://www.arpansa.gov.au/sites/default/files/rps_s-1.pdf) 
for the reference levels and their conditions of application.

## Licence

Copyright (c) 2026 Dr George Galanis, vk1pi/vk3eip. The software is available under the [MIT License](LICENSE).
