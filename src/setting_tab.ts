import {
	App,
	PluginSettingTab,
	Setting,
} from "obsidian";

import PseudocodePlugin from "main";

export class PseudocodeSettingTab extends PluginSettingTab {
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