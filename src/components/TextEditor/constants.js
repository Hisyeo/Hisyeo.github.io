//@ts-check
import { NodeSet, NodeType } from "@lezer/common";
import { styleTags, tags } from "@lezer/highlight";
import { defineLanguageFacet, languageDataProp } from "@codemirror/language";

/** 
 * A mapping between the language server's token types and Lezer node types
 * @type {{[key in import("./language").Token | "document"]: NodeType}}
 */
export const tokenToNodeType = {
    document: NodeType.define({
        id: 0,
        name: "document",
        top: true,
        props: [
            [
            languageDataProp,
            defineLanguageFacet({
                closeBrackets: { brackets: ["'"] },
            }),
            ],
        ],
        }),
    verb:         NodeType.define({id: 1,  name: 'verb'}),
    noun:         NodeType.define({id: 2,  name: 'noun'}),
    modifier:     NodeType.define({id: 3,  name: 'modifier'}),
    preposition:  NodeType.define({id: 4,  name: 'preposition'}),
    determiner:   NodeType.define({id: 5,  name: 'determiner'}),
    numeral:      NodeType.define({id: 6,  name: 'numeral'}),
    particle:     NodeType.define({id: 7,  name: 'particle'}),
    conjunction:  NodeType.define({id: 8,  name: 'conjunction'}),
}

export const parserAdapterNodeSet = new NodeSet(
    Object.values(tokenToNodeType)
).extend(styleTags({
    verb:        tags.macroName,
    noun:        tags.typeName,
    modifier:    tags.attributeName,
    preposition: tags.keyword,
    determiner:  tags.string,
    numeral:     tags.number,
    particle:    tags.typeOperator,
    conjunction: tags.keyword,
}))