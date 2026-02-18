import {MarkdownView, Plugin, View} from 'obsidian';

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
          continue
        splitFile.forEach(line => {
          
        });
      }
    }))
  }

  async delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}



  
}
