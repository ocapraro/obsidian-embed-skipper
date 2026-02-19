import { ContentType } from "ContentType";
import { Parser } from "Parser";

export class HeaderParser extends Parser {
  parseNote(rawNote: string): number | null {
    if(rawNote.match(/^#+ /))
      return 1;
    return null;
  }
  getContentType(): ContentType {
    return ContentType.Header
  }

}