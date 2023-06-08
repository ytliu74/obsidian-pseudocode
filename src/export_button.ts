const BUTTON_INFO = "Export to clipboard";
const BUTTON_EXPORTED = "Exported!";
const BUTTON_FAILED = "Failed to export";

import PseudocodePlugin from "main";

export function createExportButton(
	parentPlugin: PseudocodePlugin,
	parentDiv: HTMLDivElement,
	inlineMacros: string,
	blockContent: string
) {
	const button = parentDiv.createEl("button");
	button.classList.add("hover-button");
	button.textContent = BUTTON_INFO;
	button.addEventListener("click", () => {
		console.log(BUTTON_INFO);
		if (blockContent !== null) {
			const exportContent =
				"\\documentclass{article}\n" +
				macros(parentPlugin, inlineMacros) +
				"\n" +
				"\\begin{document}\n" +
				processBlock(blockContent, parentPlugin) +
				"\n\\end{document}";

			navigator.clipboard
				.writeText(exportContent)
				.then(() => {
					console.log("Copied to clipboard");
					button.textContent = BUTTON_EXPORTED;

					setTimeout(() => {
						button.textContent = BUTTON_INFO;
					}, 3000);
				})
				.catch((error) => {
					console.error("Failed to copy to clipboard: ", error);
					button.textContent = BUTTON_FAILED;
				});
		}
	});
	button.addEventListener("mouseover", () => {
		button.textContent = BUTTON_INFO;
	});
}

const macros = (parentPlugin: PseudocodePlugin, inlineMacros: string): string => {
	const noEnd = parentPlugin.settings.jsSettings.noEnd;
	const scopeLines = parentPlugin.settings.jsSettings.scopeLines;

	// Split inline macros into lines and remove heading or trailing spaces
	const inlineMacrosLine = inlineMacros.split("\n").map(line => line.trim());

	return `
\\usepackage{algorithm}
\\usepackage[noEnd=${noEnd},indLines=${scopeLines}]{algpseudocodex}

\\newcommand{\\And}{\\textbf{and~}}
\\newcommand{\\Or}{\\textbf{or~}}
\\newcommand{\\Xor}{\\textbf{xor~}}
\\newcommand{\\Not}{\\textbf{not~}}
\\newcommand{\\To}{\\textbf{to~}}
\\newcommand{\\DownTo}{\\textbf{downto~}}
\\newcommand{\\True}{\\textbf{true~}}
\\newcommand{\\False}{\\textbf{false~}}
\\newcommand{\\Input}{\\item[\\textbf{Input:}]}
\\renewcommand{\\Output}{\\item[\\textbf{Output:}]}
\\newcommand{\\Print}{\\State \\textbf{print~}}
\\renewcommand{\\Return}{\\State \\textbf{return~}}

\\usepackage{amsmath}
${inlineMacrosLine}
`;
};

const processBlock = (
	block: string,
	parentPlugin: PseudocodePlugin
): string => {
	if (parentPlugin.settings.jsSettings.lineNumber)
		// Replace "\begin{algorithmic}" with "\begin{algorithmic}[1]"
		block = block.replace(
			"\\begin{algorithmic}",
			"\\begin{algorithmic}[1]"
		);
	else;

	return block;
};
