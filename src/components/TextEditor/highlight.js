import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";

import { tags } from "@lezer/highlight";

export const syntaxHighlight = syntaxHighlighting(
  HighlightStyle.define([
    /* verb */        { tag: tags.macroName,     color: "#118dc3" },
    /* noun */        { tag: tags.typeName,      color: "#56b6c2" },
    /* modifier */    { tag: tags.attributeName, color: "#1da912" },
    /* preposition */ { tag: tags.keyword,       color: "#9a77cf" },
    /* determiner */  { tag: tags.string,        color: "#eea825" },
    /* numeral */     { tag: tags.number,        color: "#ee9025" },
    /* particle */    { tag: tags.typeOperator,  color: "#e05661" },
    /* conjunction */ { tag: tags.keyword,       color: "#eea825" },
  ])
);