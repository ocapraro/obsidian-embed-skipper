import { ContentType } from 'ContentType';
import { MarkdownView, Plugin } from 'obsidian';
import HtmlParser from 'parser/HtmlParser';
import { Parser } from 'parser/Parser';
import { CodeBlockParser } from 'parser/CodeBlockParser';
import { HeaderParser } from 'parser/HeaderParser';
import { DEFAULT_SETTINGS, EmbedSkipperSettings, EmbedSkipperSettingTab } from 'settings';

const MAX_LOAD_CHECKS = 100;
const PARSERS:Parser[] = [new HtmlParser(), new CodeBlockParser(), new HeaderParser()];

/**
 * The main plugin
 */
export default class EmbedSkipper extends Plugin {
  settings:EmbedSkipperSettings;
  skippedEmbeds:ContentType[] = [];

	async onload(): Promise<void> {
		await this.loadSettings();
    
    // When a file is opened
    this.registerEvent(this.app.workspace.on("file-open",async (file)=>{
      
      // Exit out if not opening a note
      if((file?.extension != "md"))
        return;
      let view:MarkdownView|null = null;
      const rawFile = await this.app.vault.cachedRead(file)
      const splitFile = rawFile.split("\n");

      // Repeat editor instantiation until editorFile and file are the same
      for(let _ = 0; _ < MAX_LOAD_CHECKS; _++) {
        await this.delay(20);
        view = this.app.workspace.getActiveViewOfType(MarkdownView)

        // Check to see if editor has loaded
        if(view?.editor.lineCount() !== splitFile.length)
          continue;
        const editorFile = view.editor.getRange(
          {ch:0,line:0},
          {ch:view.editor.getLine(splitFile.length-1).length-1, line:splitFile.length}
        );
        if(editorFile !== rawFile)
          continue;

        // Loop through the parsers and check to see if the content type matches the doc
        // and if it should be skipped. If so move the cursor to the end of the line after
        let searchingText = rawFile;
        let line = 0;
        for(let i = 0; i < PARSERS.length; i++){
          const p = PARSERS[i];
          if(!p)
            continue;
          const j = p.parseNote(searchingText);
          if (!j)
            continue;
          if(!this.skippedEmbeds.includes(p.getContentType()))
            break;
          line += j;
          
          i=-1;
          searchingText = searchingText.split("\n").slice(j).join("\n");
        }
        if(line)
          view.editor.setCursor({ch:(splitFile[line]?.length||0),line:line});
        
        break;
      }
    }));

    this.addSettingTab(new EmbedSkipperSettingTab(this.app, this));
  }

  async delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

  async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<EmbedSkipperSettings>);
    if(this.settings.codeBlock)
      this.skippedEmbeds.push(ContentType.CodeBlock);
    if(this.settings.html)
      this.skippedEmbeds.push(ContentType.Html);
    if(this.settings.header)
      this.skippedEmbeds.push(ContentType.Header);
	}

  async saveSettings() {
		await this.saveData(this.settings);
    this.skippedEmbeds = [];
    if(this.settings.codeBlock)
      this.skippedEmbeds.push(ContentType.CodeBlock);
    if(this.settings.html)
      this.skippedEmbeds.push(ContentType.Html);
    if(this.settings.header)
      this.skippedEmbeds.push(ContentType.Header);
	}

  
}
