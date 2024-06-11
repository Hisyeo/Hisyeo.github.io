import { Language, LanguageSupport } from "@codemirror/language";
import { syntaxHighlight } from "./highlight";
import { ParserAdapter } from "./ParserAdapter";
import { Facet } from "@codemirror/state";

const parserAdapter = new ParserAdapter();
const hisyeoLanguage = new Language(
  Facet.define(),
  parserAdapter,
  [],
  "Hisyëö"
);

export const hisyeo = new LanguageSupport(hisyeoLanguage, [syntaxHighlight]);