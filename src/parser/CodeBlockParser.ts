import { ContentType } from "ContentType";
import { Parser } from "parser/Parser";

export class CodeBlockParser extends Parser{
  parseNote(rawNote: string): number | null {
    const splitNote = rawNote.split("\n");
    // Exit if note doesn't start with a codeblock
    if(splitNote.length<2 || !splitNote[0]?.includes("```"))
      return null;

    // find the end of the codeblock and return the next line
    // or the last line in the file
    for (let i=1; i < splitNote.length; i++)
      if(splitNote[i]?.includes("```"))
        return Math.min(i+1,splitNote.length-1);
    return null;
  }
  getContentType(): ContentType {
    return ContentType.CodeBlock;
  }

}