import * as katex from "katex";

export function translateUnsupportedMacros(input: string): string {
	// handle \DeclarePairedDelimiter
	let output = input.replace(
		/\\DeclarePairedDelimiter\{(.*?)\}\{(.*?)\}\{(.*?)\}/g,
		"\\newcommand{$1}[1]{\\left$2 #1 \\right$3}"
	);

	// handle \DeclareMathOperator
	output = output.replace(
		/\\DeclareMathOperator\*\{(.*?)\}\{(.*?)\}/g,
		"\\newcommand{$1}{\\mathop{\\mathrm{$2}}}"
	);
	output = output.replace(
		/\\DeclareMathOperator\{(.*?)\}\{(.*?)\}/g,
		"\\newcommand{$1}{\\mathop{\\mathrm{$2}}}"
	);
	return output;
}

// This is a performance improvement for translateUnsupportedMacros
export function translateUnsupportedMacrosPerf(input: string): string {
	const stripped = input
		.replace(/(?<!\\)%.*/gm, "")
		.split("\n")
		.filter((line) => line.trim() !== "")
		.join("\n");

	return stripped.replace(
		/(\\DeclarePairedDelimiter\{(.*?)\}\{(.*?)\}\{(.*?)\})|(\\DeclareMathOperator\*\{(.*?)\}\{(.*?)\})|(\\DeclareMathOperator\{(.*?)\}\{(.*?)\})/g,
		(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10) => {
			if (p1) {
				// It's a \DeclarePairedDelimiter
				return `\\newcommand{${p2}}[1]{\\left${p3} #1 \\right${p4}}`;
			} else if (p5) {
				// It's a \DeclareMathOperator*
				return `\\newcommand{${p6}}{\\mathop{\\mathrm{${p7}}}}`;
			} else if (p8) {
				// It's a \DeclareMathOperator
				return `\\newcommand{${p9}}{\\mathop{\\mathrm{${p10}}}}`;
			} else {
				// This should never happen if the regex is correct
				console.error(`Unexpected match: ${match}`);
				return match;
			}
		}
	);
}

export function checkTranslatedMacros(input: string): string {
	const lines = input.split("\n");
	for (let i = 0; i < lines.length; i++) {
		try {
			katex.renderToString(lines[i]);
		} catch (error) {
			if (
				error instanceof katex.ParseError &&
				/redefine/.test(error.message)
			) {
				lines[i] = lines[i].replace("\\newcommand", "\\renewcommand");
				console.log(`Redefining ${lines[i]}`);
			} else {
				throw error;
			}
		}
	}
	return lines.join("\n");
}
