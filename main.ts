import { App, Notice, Plugin, PluginSettingTab, Setting, MarkdownView, Editor, Modal } from 'obsidian';

import * as pseudocode from "pseudocode";

// Remember to rename these classes and interfaces!

interface PseudocodeSettings {
	indentSize: string,
	commentDelimiter: string,
	lineNumber: boolean,
	lineNumberPunc: string,
	noEnd: boolean,
	captionCount: undefined
}

const DEFAULT_SETTINGS: PseudocodeSettings = {
	indentSize: '1.2em',
	commentDelimiter: '//',
	lineNumber: false,
	lineNumberPunc: ':',
	noEnd: false,
	captionCount: undefined
}

export default class PseudocodePlugin extends Plugin {
	settings: PseudocodeSettings;

	async pseudocodeHandler(source: string, el: HTMLElement, ctx: any): Promise<any> {
		// const rawRows: string[] = source.split("\n");

		const katex = el.createEl("script");
		katex.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.js";
		katex.integrity = "sha256-F/Xda58SPdcUCr+xhSGz9MA2zQBPb0ASEYKohl8UCHc=";
		katex.crossOrigin = "anonymous";

		const preEl = el.createEl("pre", { cls: "code", text: source });

		console.log(el);
		pseudocode.renderElement(preEl, this.settings);
	}

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor("pcode", this.pseudocodeHandler.bind(this));

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PseudocodeSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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

		containerEl.createEl('h1', { text: 'Pseudocode Plugin Settings' });

		// Instantiate Indent Size setting
		new Setting(containerEl)
			.setName("Indent Size")
			.setDesc("The indent size of inside a control block, e.g. if, for, etc. The unit must be in 'em'.")
			.addText(text => text
				.setValue(this.plugin.settings.indentSize)
				.onChange(async (value) => {
					this.plugin.settings.indentSize = value;
					await this.plugin.saveSettings();
				})
			);

		// Instantiate Comment Delimiter setting
		new Setting(containerEl)
			.setName("Comment Delimiter")
			.setDesc("The string used to indicate a comment in the pseudocode.")
			.addText(text => text
				.setValue(this.plugin.settings.commentDelimiter)
				.onChange(async (value) => {
					this.plugin.settings.commentDelimiter = value;
					await this.plugin.saveSettings();
				})
			);

		// Instantiate Show Line Numbers setting
		new Setting(containerEl)
			.setName("Show Line Numbers")
			.setDesc("Whether line numbering is enabled.")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.lineNumber)
				.onChange(async (value) => {
					this.plugin.settings.lineNumber = value;
					await this.plugin.saveSettings();
				})
			);

		// Instantiate Line Number Punctuation setting
		new Setting(containerEl)
			.setName("Line Number Punctuation")
			.setDesc("The punctuation used to separate the line number from the pseudocode.")
			.addText(text => text
				.setValue(this.plugin.settings.lineNumberPunc)
				.onChange(async (value) => {
					this.plugin.settings.lineNumberPunc = value;
					await this.plugin.saveSettings();
				})
			);

		// Instantiate No End setting
		new Setting(containerEl)
			.setName("No End")
			.setDesc("If enabled, pseudocode blocks will not have an 'end' statement.")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.noEnd)
				.onChange(async (value) => {
					this.plugin.settings.noEnd = value;
					await this.plugin.saveSettings();
				})
			);

		// Instantiate Caption Count setting
		// new Setting(containerEl)
		// 	.setName("Caption Count")
		// 	.setDesc("The number to start captioning pseudocode blocks from.")
		// 	.addText(text => text
		// 		.setValue(this.plugin.settings.captionCount)
		// 		.onChange(async (value) => {
		// 			this.plugin.settings.captionCount = value;
		// 			await this.plugin.saveSettings();
		// 		})
		// 	);
	}
}

``
