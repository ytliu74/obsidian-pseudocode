import {
	translateUnsupportedMacrosPerf,
	checkTranslatedMacros,
} from "./latex_translator";

export function extractInlineMacros(source: string): [string, string] {
  const sourceLines = source.split("\n");
  const macroStartIndex = sourceLines.findIndex(line => line.includes("\\begin{algorithm}"));

  const macroLines = sourceLines.slice(0, macroStartIndex).join("\n");
  const nonMacroLines = sourceLines.slice(macroStartIndex).join("\n");

  let inlineMacros = "";

  try {
    const translated = translateUnsupportedMacrosPerf(macroLines);
    inlineMacros = checkTranslatedMacros(translated);
  } catch (error) {

    console.error(error);
  }

  return [inlineMacros, nonMacroLines];
}
