import { ContentType } from "ContentType";
import { Parser } from "Parser";
import * as htmlparser2 from "htmlparser2";

export default class HtmlParser extends Parser {
  parseNote(rawNote: string): number | null {
    let tagCount = 0;
    const tags:string[] = [];
    let found = false;
    // Searches through the text for any html tags, until it finds plaintext
    const parser = new htmlparser2.Parser({
      onopentagname(name) {
        tagCount++;
        if(!found)
          tags.push(name)
      },
      onclosetag(name,isImplied) {
        tagCount--;
        if(!isImplied && !found)
          tags.push(name);
      },
      ontext(t) {
        if(tagCount>0 || found)
          return;
        found = true;
      }
    });
    parser.write(rawNote);
    parser.end();

    tags.reverse();
    let searchingText = rawNote;
    // cut out all the tags
    while (tags.length>0) {
      const tag = tags.pop();
      if(!tag)
        continue;
      const tagIndex = searchingText.indexOf(tag);
      searchingText = searchingText.slice(tagIndex+tag.length);
    }

    // return the number of lines in the original versus the new
    // to get the index of where the html element stops.
    return rawNote.split("\n").length - (searchingText.split("\n").length-1);
  }

  getContentType(): ContentType {
    return ContentType.Html;
  }

}