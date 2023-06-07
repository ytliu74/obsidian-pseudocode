import { Editor, MarkdownView, Plugin, Notice } from "obsidian";

import { PseudocodeSettingTab } from "src/setting_tab";
import { PseudocodeSuggestor } from "src/auto_complete";
import {
	PseudocodeSettings,
	DEFAULT_SETTINGS,
	PseudocodeBlockInit,
	BLOCK_NAME,
} from "src/setting";
import {
	translateUnsupportedMacrosPerf,
	checkTranslatedMacros,
} from "src/latex_translator";
import { createExportButton } from "src/export_button";
import { extractInlineMacros } from "src/inline_macro";

import * as pseudocode from "pseudocode";

export default class PseudocodePlugin extends Plugin {
	settings: PseudocodeSettings;
	preamble: string = "";

	async pseudocodeHandler(
		source: string,
		el: HTMLElement,
		ctx: any
	): Promise<any> {
		const blockDiv = el.createDiv({ cls: "pseudocode-block" });
		const blockWidth = this.settings.blockSize;
		blockDiv.style.width = `${blockWidth}em`;

		// Extract inline macros
		const [inlineMacros, nonMacroLines] = extractInlineMacros(source);
		const allPreamble = this.preamble + inlineMacros;

		// find all $ enclosements in source, and add the preamble.
		// TODO: Might be able to optimize.
		const mathRegex = /\$(.*?)\$/g;
		const withPreamble = nonMacroLines.replace(mathRegex, (_, group1) => {
			return `$${allPreamble}${group1}$`;
		});

		const preEl = blockDiv.createEl("pre", {
			cls: "code",
			text: withPreamble,
		});

		try {
			pseudocode.renderElement(preEl, this.settings.jsSettings);
			createExportButton(this, blockDiv, source);
		} catch (error) {
			console.log(error);
			const errorSpan = blockDiv.createEl("span", {
				text: "\u274C " + error.message,
			});
			errorSpan.classList.add("error-message");
			blockDiv.empty();
			blockDiv.appendChild(errorSpan);
		}
	}

	async onload() {
		await this.loadSettings();

		if (this.settings.preambleEnabled) {
			console.log("Preamble is enabled.");
			await this.loadPreamble();
		}

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

	onunload() {}

	async loadPreamble() {
		try {
			this.preamble = await this.app.vault.adapter.read(
				this.settings.preamblePath
			);
		} catch (error) {
			console.log(error);
			// Extract the search path from the error message.
			const searchPath = error.message.match(/'(.*?)'/g)[0];
			new Notice(
				"Pseudocode Plugin: Preamble file not found at " +
					searchPath +
					"."
			);
			this.preamble = "";
			return;
		}

		try {
			this.preamble = translateUnsupportedMacrosPerf(this.preamble);
			this.preamble = checkTranslatedMacros(this.preamble);
			console.log("Loaded preamble:\n" + this.preamble);
			console.log(
				"Preamble file loaded. You can check the detail in console."
			);
			if (this.settings.preambleLoadedNotice) {
				new Notice("Pseudocode Plugin: Preamble file loaded.");
			}
		} catch (error) {
			console.log(error);
			new Notice(
				"Pseudocode Plugin: Preamble file contains invalid LaTeX. " +
					"Please refer to console for details."
			);
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
