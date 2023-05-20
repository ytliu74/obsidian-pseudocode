import {
	App,
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	MarkdownView,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	Notice,
} from "obsidian";

import * as pseudocode from "pseudocode";
import * as katex from "katex";

// This is the setting for pseudocode.js
interface PseudocodeJsSettings {
	indentSize: string;
	commentDelimiter: string;
	lineNumber: boolean;
	lineNumberPunc: string;
	noEnd: boolean;
	captionCount: undefined;
}

// Setting for this plugin
interface PseudocodeSettings {
	blockSize: number;
	preamblePath: string;
	preambleLoadedNotice: boolean;
	jsSettings: PseudocodeJsSettings;
}

const DEFAULT_SETTINGS: PseudocodeSettings = {
	blockSize: 99,
	preamblePath: "preamble.sty",
	preambleLoadedNotice: false,
	jsSettings: {
		indentSize: "1.2em",
		commentDelimiter: "//",
		lineNumber: false,
		lineNumberPunc: ":",
		noEnd: false,
		captionCount: undefined,
	}
};

const PseudocodeBlockInit =
	"```pseudo\n" +
	"\t\\begin{algorithm}\n\t\\caption{Algo Caption}\n\t\\begin{algorithmic}" +
	"\n\n\t\\end{algorithmic}\n\t\\end{algorithm}" +
	"\n```";

const BLOCK_NAME = "pseudo";

export default class PseudocodePlugin extends Plugin {
	settings: PseudocodeSettings;
	preamble: string;

	async pseudocodeHandler(
		source: string,
		el: HTMLElement,
		ctx: any
	): Promise<any> {
		const blockDiv = el.createDiv({ cls: "pseudocode-block" });
		const blockWidth = this.settings.blockSize;
		blockDiv.style.width = `${blockWidth}em`;

		// find all $ enclosements in source, and add the preamble.
		// TODO: Might be able to optimize.
		const mathRegex = /\$(.*?)\$/g;
		source = source.replace(mathRegex, (match, group1) => {
			return '$' + this.preamble + group1 + '$';
		});

		const preEl = blockDiv.createEl("pre", { cls: "code", text: source });

		try {
			pseudocode.renderElement(preEl, this.settings.jsSettings);
		} catch (error) {
			console.log(error);
			const errorSpan = blockDiv.createEl("span", { text: "\u274C " + error.message });
			errorSpan.classList.add("error-message");
			blockDiv.empty();
			blockDiv.appendChild(errorSpan);
		}
	}

	async onload() {
		await this.loadSettings();
		await this.loadPreamble();

		this.registerMarkdownCodeBlockProcessor(
			BLOCK_NAME,
			this.pseudocodeHandler.bind(this)
		);

		// Register suggest
		this.registerEditorSuggest(new PseudocodeSuggestor(this));

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PseudocodeSettingTab(this.app, this));

		// Auto-gen pseudocode block command.
		this.addCommand({
			id: "pseudocode-in-obs",
			name: "Insert a new pseudocode block",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection(PseudocodeBlockInit);
			},
		});
	}

	onunload() { }

	async loadPreamble() {
		try { this.preamble = await this.app.vault.adapter.read(this.settings.preamblePath); }
		catch (error) {
			console.log(error);
			// Extract the search path from the error message.
			const searchPath = error.message.match(/'(.*?)'/g)[0];
			new Notice("Pseudocode Plugin: Preamble file not found at " + searchPath + ".");
			this.preamble = "";
			return;
		}

		try {
			katex.renderToString(this.preamble);
			console.log("Preamble file loaded.");
			if (this.settings.preambleLoadedNotice) {
				new Notice("Pseudocode Plugin: Preamble file loaded.");
			}
		}
		catch (error) {
			console.log(error);
			new Notice("Pseudocode Plugin: Preamble file contains invalid LaTeX. " +
				"Please refer to console for details.");
			this.preamble = "";
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class PseudocodeSettingTab extends PluginSettingTab {
	plugin: PseudocodePlugin;

	constructor(app: App, plugin: PseudocodePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h1", { text: "Pseudocode Plugin Settings" });

		containerEl.createEl("h2", { text: "Render Behevior" });

		// Instantiate Block Size setting
		new Setting(containerEl)
			.setName("Block Size")
			.setDesc(
				"The width of the pseudocode block. The unit is 'em'." +
				" The default value is 99, which will work as the max width of the editor." +
				" '30' looks good for me."
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.blockSize.toString())
					.onChange(async (value) => {
						this.plugin.settings.blockSize = Number(value);
						await this.plugin.saveSettings();
					})
			);

		// Instantiate Indent Size setting
		new Setting(containerEl)
			.setName("Indent Size")
			.setDesc(
				"The indent size of inside a control block, e.g. if, for, etc. The unit must be in 'em'."
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.jsSettings.indentSize)
					.onChange(async (value) => {
						this.plugin.settings.jsSettings.indentSize = value;
						await this.plugin.saveSettings();
					})
			);

		// Instantiate Comment Delimiter setting
		new Setting(containerEl)
			.setName("Comment Delimiter")
			.setDesc("The string used to indicate a comment in the pseudocode.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.jsSettings.commentDelimiter)
					.onChange(async (value) => {
						this.plugin.settings.jsSettings.commentDelimiter = value;
						await this.plugin.saveSettings();
					})
			);

		// Instantiate Show Line Numbers setting
		new Setting(containerEl)
			.setName("Show Line Numbers")
			.setDesc("Whether line numbering is enabled.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.jsSettings.lineNumber)
					.onChange(async (value) => {
						this.plugin.settings.jsSettings.lineNumber = value;
						await this.plugin.saveSettings();
					})
			);

		// Instantiate Line Number Punctuation setting
		new Setting(containerEl)
			.setName("Line Number Punctuation")
			.setDesc(
				"The punctuation used to separate the line number from the pseudocode."
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.jsSettings.lineNumberPunc)
					.onChange(async (value) => {
						this.plugin.settings.jsSettings.lineNumberPunc = value;
						await this.plugin.saveSettings();
					})
			);

		// Instantiate No End setting
		new Setting(containerEl)
			.setName("No End")
			.setDesc(
				"If enabled, pseudocode blocks will not have an 'end' statement."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.jsSettings.noEnd)
					.onChange(async (value) => {
						this.plugin.settings.jsSettings.noEnd = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h2", { text: "Preamble Settings" });

		// Instantiate Preamble Path setting
		new Setting(containerEl)
			.setName("Preamble Path")
			.setDesc(
				"The path to the preamble file. The path is relative to the vault root."
			)
			.addText((text) =>
				text
					// .setValue(this.plugin.settings.preamblePath)
					.setValue(this.plugin.settings.preamblePath)
					.onChange(async (value) => {
						this.plugin.settings.preamblePath = value;
						await this.plugin.saveSettings();
					})
			);

		// Instantiate Preamble Load Sign setting
		new Setting(containerEl)
			.setName("Preamble Loaded Notice")
			.setDesc("Whether to show a notice everytime the preamble is loaded.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.preambleLoadedNotice)
					.onChange(async (value) => {
						this.plugin.settings.preambleLoadedNotice = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

class PseudocodeSuggestor extends EditorSuggest<string> {
	plugin: PseudocodePlugin;

	constructor(plugin: PseudocodePlugin) {
		super(plugin.app);
		this.plugin = plugin;
	}

	onTrigger(
		cursor: EditorPosition,
		editor: Editor,
		file: TFile
	): EditorSuggestTriggerInfo | null {
		// perf: Use the "\" to tell whether to return.
		const currentLineToCursor = editor
			.getLine(cursor.line)
			.slice(0, cursor.ch);
		const currentLineLastWordStart = currentLineToCursor.lastIndexOf("\\");
		// if there is no word, return null
		if (currentLineLastWordStart === -1) return null;

		// If is within a LaTeX $$ wrap, return null
		const currentLineLastMoneyMark = currentLineToCursor.lastIndexOf("$");
		if (currentLineLastMoneyMark != -1) return null;

		const currentFileToCursor = editor.getRange({ line: 0, ch: 0 }, cursor);
		const indexOfLastCodeBlockStart =
			currentFileToCursor.lastIndexOf("```");

		// check if this is a pseudocode block
		const isPseudocode =
			currentFileToCursor.slice(
				indexOfLastCodeBlockStart + 3,
				indexOfLastCodeBlockStart + 3 + BLOCK_NAME.length
			) == BLOCK_NAME;

		if (!isPseudocode) return null;

		return {
			start: { line: cursor.line, ch: currentLineLastWordStart },
			end: cursor,
			query: currentLineToCursor.slice(currentLineLastWordStart),
		};
	}

	getSuggestions(
		context: EditorSuggestContext
	): string[] | Promise<string[]> {
		const query = context.query;

		const suggestions = this.pseudocodeKeywords.filter((value) =>
			value.toLowerCase().startsWith(query.toLowerCase())
		);

		return suggestions;
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		el.addClass("suggestion");
		const suggestContent = el.createDiv({ cls: "suggestion-content" });
		suggestContent.setText(value);
	}

	selectSuggestion(value: string, evt: MouseEvent | KeyboardEvent): void {
		if (this.context) {
			const editor = this.context.editor;
			const suggestion = value;
			const start = this.context.start;
			const end = editor.getCursor();

			editor.replaceRange(suggestion, start, end);
			const newCursor = end;
			newCursor.ch = start.ch + suggestion.length;

			editor.setCursor(newCursor);

			this.close();
		}
	}

	private pseudocodeKeywords: string[] = [
		"\\begin{algorithmic}",
		"\\begin{algorithm}",
		"\\end{algorithmic}",
		"\\end{algorithm}",
		"\\caption{}",
		"\\Procedure{}{}",
		"\\EndProcedure",
		"\\Function{}{}",
		"\\EndFunction",
		"\\Require",
		"\\Ensure",
		"\\Input",
		"\\Output",
		"\\State",
		"\\Return",
		"\\Print",
		"\\For{}",
		"\\EndFor",
		"\\If{}",
		"\\Elif{}",
		"\\EndIf",
		"\\While{}",
		"\\EndWhile",
		"\\Repeat",
		"\\Until{}",
		"\\Comment{}",
		"\\{",
		"\\}",
		"\\$",
		"\\&",
		"\\#",
		"\\%",
		"\\_",
		"\\gets",
		"\\Call{}{}",
		"\\And",
		"\\Or",
		"\\Xor",
		"\\Not",
		"\\To",
		"\\DownTo",
		"\\True",
		"\\False",
		"\\tiny",
		"\\scriptsize",
		"\\footnotesize",
		"\\small",
		"\\normalsize",
		"\\Large",
		"\\Huge",
		"\\rmfamily",
		"\\sffamily",
		"\\ttfamily",
		"\\upshape",
		"\\itshape",
		"\\slshape",
		"\\scshape",
		"\\bfseries",
		"\\mdseries",
		"\\lfseries",
		"\\textnormal{}",
		"\\textrm{}",
		"\\textsf{}",
		"\\texttt{}",
		"\\textup{}",
		"\\textit{}",
		"\\textsl{}",
		"\\textsc{}",
		"\\uppercase{}",
		"\\lowercase{}",
		"\\textbf{}",
		"\\textmd{}",
		"\\textlf{}",
	];
}
