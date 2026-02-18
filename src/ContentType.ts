export enum ContentType {
  FullHtml,
  SingleHtml,
  PartialHtml,
  CodeBlock,
  Header,
  Body
}

export const contentTypePatterns:{[key:number]:RegExp} = {
  [ContentType.FullHtml]: /^<.*>.*<\/.*>$/,
  [ContentType.SingleHtml]: /^<img.*>.*/,
  [ContentType.PartialHtml]: /^<.*>.*/,
  [ContentType.CodeBlock]: /^```/,
  [ContentType.Header]: /^#+/,
  [ContentType.Body]: /.?/,
};