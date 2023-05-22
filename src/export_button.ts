const BUTTON_INFO = "Export to clipboard";
const BUTTON_EXPORTED = "Exported!";
const BUTTON_FAILED = "Failed to export";

export function createExportButton(
	parentDiv: HTMLDivElement,
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
				MACROS +
				"\n" +
				"\\begin{document}\n" +
				blockContent +
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

const MACROS =
	"\\usepackage{algorithm}\n" +
	"\\usepackage{algpseudocode}\n" +
	"\n" +
	"\\newcommand{\\And}{\\textbf{and~}}\n" +
	"\\newcommand{\\Or}{\\textbf{or~}}\n" +
	"\\newcommand{\\Xor}{\\textbf{xor~}}\n" +
	"\\newcommand{\\Not}{\\textbf{not~}}\n" +
	"\\newcommand{\\To}{\\textbf{to~}}\n" +
	"\\newcommand{\\DownTo}{\\textbf{downto~}}\n" +
	"\\newcommand{\\True}{\\textbf{true~}}\n" +
	"\\newcommand{\\False}{\\textbf{false~}}\n" +
	"\\newcommand{\\Input}{\\textbf{input~}}\n" +
	"\\newcommand{\\Output}{\\textbf{output~}}\n";
