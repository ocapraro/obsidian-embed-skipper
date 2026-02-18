import { ContentType, contentTypePatterns } from 'ContentType';
import {MarkdownView, Plugin} from 'obsidian';

const MAX_LOAD_CHECKS = 100;


/**
 * The main plugin
 */
export default class EmbedSkipper extends Plugin {

	async onload(): Promise<void> {
    // When a file is opened
    this.registerEvent(this.app.workspace.on("file-open",async (file)=>{
      
      // Exit out if not opening a note
      if((file?.extension != "md"))
        return;
      let view = null;
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
        console.log(this.getContentType(splitFile[0]+""));
        // splitFile.forEach(line => {
        //   this.getContentType(line);
        // });
        break;
      }
    }));
  }

  async delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

  getContentType(line:string) {
    for (let i = 0; i < Object.values(ContentType).length; i++) {
      const pattern = contentTypePatterns[i];
      if(!pattern)
        continue;
      const match = line.match(pattern);
      if (!match)
        continue;
      return ContentType[i];
    }
    return ContentType.Body;
  }

  
}
