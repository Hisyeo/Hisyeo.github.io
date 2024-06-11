import { Parser, Tree, Input, PartialParse, TreeFragment } from "@lezer/common";
import {LanguageServer} from './language';
import {parserAdapterNodeSet, tokenToNodeType} from './constants';

const DEFAULT_NODE_GROUP_SIZE = 4;

export class ParserAdapter extends Parser {
  #languageServer = new LanguageServer();

  /**
   * 
   * @param {string} document 
   * @returns {Tree} 
   */
  #buildTree(document) {
    const buffer = this.#languageServer.getBufferStream(document);
  
    if (buffer.length < 1) {
      return Tree.build({
        buffer: [
          tokenToNodeType.document.id,
          0,
          document.length,
          DEFAULT_NODE_GROUP_SIZE,
        ],
        nodeSet: parserAdapterNodeSet,
        topID: tokenToNodeType.document.id,
      });
    }
  
    return Tree.build({
      buffer,
      nodeSet: parserAdapterNodeSet,
      topID: tokenToNodeType.document.id,
    });
  }

  /**
   * 
   * @param {Input} input 
   * @param {readonly TreeFragment[]} fragments 
   * @param {readonly { from: number; to: number }[]} ranges 
   * @returns {PartialParse}
   */
  createParse(input, fragments, ranges) {
    return this.startParse(input, fragments, ranges);
  }

  /**
   * 
   * @param {string | Input} input 
   * @param {readonly TreeFragment[] | undefined} [_0] 
   * @param {readonly { from: number; to: number }[] | undefined} [_1]
   * @returns {PartialParse} 
   */
  startParse(input, _0, _1) {
    const document =
      typeof input === "string" ? input : input.read(0, input.length);

    const tree = this.#buildTree(document);

    return {
      stoppedAt: input.length,
      parsedPos: input.length,
      stopAt: (_) => {},
      advance: () => tree,
    };
  }
}