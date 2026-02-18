import { ContentType } from "ContentType";

/**
 * Abstract class for parsing a note to find where an embed ends
 */
export abstract class Parser {
  /**
   * Gets the line number of where the embed ends, or null if it's not of the checking type
   * @param rawNote the full note as a string
   */
  abstract parseNote(rawNote:string):number|null;

  /**
   * Returns the ContentType the parser is checking for
   */
  abstract getContentType():ContentType;
}