/* 
 * @author: Micha Halla
 * 
 * compiles given AST into machine code strings
 */

"use-strict";

class Compiler {

  constructor() {}

  generate(ast){
    let out = "";
    for(let i of ast) {
      out+=this.genExpr(i);
    }
    return out;
  }

  genExpr(ast){
    if(ast.next==undefined) return ast.value+"\r\n";
    return ast.value+this.genExpr(ast.next);
  }
};
