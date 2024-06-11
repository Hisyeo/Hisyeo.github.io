import { tokenToNodeType } from "../constants";
import HisyeoParserListener from "./build/HisyeoParserListener";
import { ParserRuleContext } from "antlr4ng";

const DEFAULT_NODE_GROUP_SIZE = 4;

export class HisyeoLezerListener extends HisyeoParserListener {
    constructor(buffer) {
        super()

        /**
         * @type {number[]}
         */
        this.buffer = buffer
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitVerbPhrase(ctx) {

        /**
         * @type {ParserRuleContext}
         */
        const word = ctx.baseModifier() ?? ctx.baseNoun()
        this.buffer.push(
            tokenToNodeType["verb"],
            word.start.start,
            word.stop.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }


    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitTransitiveVerbPhrase(ctx) {

        /**
         * @type {ParserRuleContext}
         */
        const word = ctx.baseVerb()
        this.buffer.push(
            tokenToNodeType["verb"],
            word.start.start,
            word.stop.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitModifierClause(ctx) {

        /**
         * @type {ParserRuleContext}
         */
        const word = ctx.expandedWord()
        this.buffer.push(
            tokenToNodeType["modifier"],
            word.start.start,
            word.stop.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitRelativeQuantity(ctx) {
        this.buffer.push(
            tokenToNodeType["determiner"],
            ctx.start.start,
            ctx.stop.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitNominalQuantity(ctx) {
        this.buffer.push(
            tokenToNodeType["numeral"],
            ctx.start.start,
            ctx.stop.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitVerbMarker(ctx) {
        this.buffer.push(
            tokenToNodeType["preposition"],
            ctx.start.start,
            ctx.stop.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitVerbModifier(ctx) {
        this.buffer.push(
            tokenToNodeType["particle"],
            ctx.start.start,
            ctx.stop.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitPreposition(ctx) {
        
        /**
         * @type {ParserRuleContext}
         */
        const word = ctx.intransitivePrepParticle()
        this.buffer.push(
            tokenToNodeType["preposition"],
            word.start.start,
            word.stop.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitTransitivePreposition(ctx) {
        
        /**
         * @type {import('antlr4ng').Token | ParserRuleContext}
         */
        let word = ctx.Co()
        if (word) {
            this.buffer.push(
                tokenToNodeType["preposition"],
                word.start,
                word.stop,
                DEFAULT_NODE_GROUP_SIZE
            )
        } else {
            word = ctx.intransitivePrepParticle()
            this.buffer.push(
                tokenToNodeType["preposition"],
                word.start.start,
                word.stop.stop,
                DEFAULT_NODE_GROUP_SIZE
            )
        }

        

    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitNounPhrase(ctx) {
        
        /**
         * @type {ParserRuleContext}
         */
        const word = ctx.expandedWord()
        this.buffer.push(
            tokenToNodeType["noun"],
            word.start.start,
            word.stop.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitNewAgentPredicateClause(ctx) {
        
        /**
         * @type {import('antlr4ng').Token}
         */
        const word = ctx.Vos()
        this.buffer.push(
            tokenToNodeType["particle"],
            word.start,
            word.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitSameAgentPredicateClause(ctx) {
        
        /**
         * @type {import('antlr4ng').Token}
         */
        const word = ctx.Do()
        this.buffer.push(
            tokenToNodeType["particle"],
            word.start,
            word.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitConnector(ctx) {
        this.buffer.push(
            tokenToNodeType["conjunction"],
            ctx.start.start,
            ctx.stop.stop,
            DEFAULT_NODE_GROUP_SIZE
        )
    }

    /**
     * 
     * @param {ParserRuleContext} ctx 
     */
    exitSentences(ctx) {
        const documentNodeSize = this.buffer.length + DEFAULT_NODE_GROUP_SIZE
        this.buffer.push(
            tokenToNodeType["document"],
            ctx.start.start,
            ctx.stop.stop,
            documentNodeSize
        )
    }

}