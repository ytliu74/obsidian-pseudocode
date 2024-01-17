import {
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	TFile,
} from "obsidian";

import { BLOCK_NAME } from "src/setting";

import PseudocodePlugin from "main";

export class PseudocodeSuggestor extends EditorSuggest<string> {
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
		"\\Else",
		"\\Elif{}",
		"\\EndIf",
		"\\While{}",
		"\\EndWhile",
		"\\Repeat",
		"\\Continue",
		"\\Break",
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
