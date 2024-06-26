// This is the setting for pseudocode.js
export interface PseudocodeJsSettings {
	indentSize: string;
	commentDelimiter: string;
	lineNumber: boolean;
	lineNumberPunc: string;
	noEnd: boolean;
	captionCount: undefined;
	scopeLines: boolean;
}

// Setting for this plugin
export interface PseudocodeSettings {
	blockSize: number;
	preambleEnabled: boolean;
	preamblePath: string;
	preambleLoadedNotice: boolean;
	followSystemTheme: boolean;
	jsSettings: PseudocodeJsSettings;
}

export const DEFAULT_SETTINGS: PseudocodeSettings = {
	blockSize: 99,
	preambleEnabled: false,
	preamblePath: "preamble.sty",
	preambleLoadedNotice: false,
	followSystemTheme: false,
	jsSettings: {
		indentSize: "1.2em",
		commentDelimiter: "//",
		lineNumber: false,
		lineNumberPunc: ":",
		noEnd: false,
		captionCount: undefined,
		scopeLines: false,
	},
};

export const PseudocodeBlockInit =
	"```pseudo\n" +
	"\t\\begin{algorithm}\n\t\\caption{Algo Caption}\n\t\\begin{algorithmic}" +
	"\n\n\t\\end{algorithmic}\n\t\\end{algorithm}" +
	"\n```";

export const BLOCK_NAME = "pseudo";
