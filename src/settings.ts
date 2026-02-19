import EmbedSkipper from "main";
import { PluginSettingTab, Setting } from "obsidian";

export interface EmbedSkipperSettings {
  codeBlock:boolean;
  html:boolean;
  header:boolean;
}

export const DEFAULT_SETTINGS: EmbedSkipperSettings = {
  codeBlock:true,
  html:true,
  header:false
}

export class EmbedSkipperSettingTab extends PluginSettingTab {
  plugin: EmbedSkipper;

  display(): void {
    const {containerEl} = this;

    containerEl.empty();
		containerEl.createEl('h1', {text: 'Embed Skipper Settings'});
    new Setting(containerEl)
    .setName("Skip Code Blocks")
    .setDesc("Skip past code blocks at the top of the file.")
    .addToggle(toggle => toggle
      .setValue(this.plugin.settings.codeBlock)
      .onChange(async (value)=> {
        this.plugin.settings.codeBlock = value;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl)
    .setName("Skip HTML Blocks")
    .setDesc("Skip past html blocks at the top of the file.")
    .addToggle(toggle => toggle
      .setValue(this.plugin.settings.html)
      .onChange(async (value)=> {
        this.plugin.settings.html = value;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl)
    .setName("Skip Headers")
    .setDesc("Skip past the headers at the top of the file.")
    .addToggle(toggle => toggle
      .setValue(this.plugin.settings.header)
      .onChange(async (value)=> {
        this.plugin.settings.header = value;
        await this.plugin.saveSettings();
      })
    );

  }

}