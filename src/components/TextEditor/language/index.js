import { CharStream, CommonTokenStream, ParseTreeWalker } from "antlr4ng";
import HisyeoLexer from "./build/HisyeoLexer";
import HisyeoParser from "./build/HisyeoParser";
import { HisyeoLezerListener } from "./LezerListener";

/**
 * @constant
 * @readonly
 */
const supportedTokens = [
    "numeral",
    "verb",
    "modifier",
    "noun",
    "preposition",
    "conjunction",
    "determiner",
    "particle",
];

/**
 * @typedef {typeof supportedTokens[number]} Token
 */

export class LanguageServer {
    constructor() {
        this.buffer = []
    }
    /**
     * Parse a text value and return a buffer of nodes
     * @param {string} value 
     * @returns {number[]}
     */
    getBufferStream(value) {
        const chars = CharStream.fromString(value)
        const lexer = new HisyeoLexer(chars)
        const tokenStream = new CommonTokenStream(lexer)
        const parser = new HisyeoParser(tokenStream)
        parser.sentences()
        const listener = new HisyeoLezerListener(this.buffer)
        const walker = new ParseTreeWalker()
        walker.walk(listener, parser)
        return this.buffer
    }

}