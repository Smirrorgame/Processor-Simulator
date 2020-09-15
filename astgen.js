"use-strict";

class AstGen {
  constructor() {
    this.OPS = Constants.OPS;
    this.branches = {};
    this.spaces = 0;
  }

  generateAst(data){
    let lines = data.split("\r\n");
    let ast = [];
    for(let i=0;i<lines.length;i++){
      let str = lines[i];
      // ignore spaces and comments
      if(str==="" || str.match("^#[\\w|\\s]*")!=null) {
        this.spaces++;
        continue;
      }
      // catch branch definitions
      if(str.match("^(([A-Z]+)(:){1})$")){
        //register detected branch
        this.branches[str.substring(0, str.length-1)] = (i-Object.keys(this.branches).length-this.spaces);
        continue;
      }
      // add line to ast
      let expressions = lines[i].split(" ");
      try {
        ast.push(this.genNode(expressions, expressions.length, expressions[0].toLowerCase()));
      }catch(error){
        let e = `Error in source file at line ${(i+1)}\n${error.message}`;
        console.error(e);
        alert(e);
      }
    }
    return ast;
  }

  genNode(expressions, depth, firstExp){
    if(expressions.length==0) return undefined;
    let expr = expressions.shift();
    let next = this.genNode(expressions, expressions.length, firstExp);
    // expression is an Operation keyword
    if(Constants.Keywords[expr]!=undefined){
      let keyword = Constants.Keywords[expr.toLowerCase()];
      if(depth>keyword.args.length+1) throw new Error(`Too many arguments! got ${depth-1}, allowed: ${keyword.args.length}`);
      return {
        "type": expr,
        "value": keyword.code,
        "next": next
      };
      // expression is a register
    }else if(Constants.REGISTERS[expr.toLowerCase()]!=undefined){
      let reg = Constants.REGISTERS[expr];
      let op = Constants.Keywords[firstExp];
      let value = decToBin(reg, op.args[op.args.length-depth]);
      return {
        "type": "reg",
        "value": value,
        "next": next
      };
      // expression is a branch name
    }else if(this.branches[expr]!=undefined){
      let op = Constants.Keywords[firstExp];
      let value = decToBin(this.branches[expr], op.args[op.args.length-depth]);
      return {
        "type": "branch",
        "value": value,
        "next": next
      };
      // expression is a decimal
    }else if(expr.match("^\\d+$")!=null){
      let op = Constants.Keywords[firstExp];
      let value = decToBin(expr, op.args[op.args.length-depth]);
      return {
        "type": "num",
        "value": value,
        "next": next
      };
      //expression is a binary string
    }else if(expr.match("^0b\\d[01]{3,16}$")!=null){
      let op = Constants.Keywords[firstExp];
      let len = op.args[op.args.length-depth];
      if(expr.match(`^0b\\d[01]{${len-1}}$`)){
      let value = expr.substring(2, expr.length);
      return {
        "type": "num",
        "value": value,
        "next": next
      };
    }else{
      throw new Error(`Syntax error: "${expr}" does not match expected length ${len}`);
    }
      // unknown expession
    }else{
      throw new Error(`Syntax error: "${expr}" is an unknown Expression`);
    }
  }
}
