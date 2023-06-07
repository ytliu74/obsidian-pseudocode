import {
	translateUnsupportedMacrosPerf,
	checkTranslatedMacros,
} from "./latex_translator";

export function extractInlineMacros(source: string): [string, string] {
	const lines = source.split("\n");

	let i: number;
	for (i = 0; i < lines.length; i++) {
		if (lines[i].includes("\\begin{algorithm}")) break;
	}

	const macroLines = lines.slice(0, i).join("\n");
	const nonMacroLines = lines.slice(i).join("\n");

	let inlineMacros = "";
	try {
		const translated = translateUnsupportedMacrosPerf(macroLines);
		inlineMacros = checkTranslatedMacros(translated);
	} catch (error) {
		console.error(error);
	}

	return [inlineMacros, nonMacroLines];
}
