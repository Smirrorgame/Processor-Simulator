let registers = [];
let memory = [];
let instructionRegister;
let dataRegister = "00000000";
let pc = 0;
window.onload = function onPageLoaded() {
  initRegisters();
  reset();
  readFileListener();
}

function showInstruction(i){
  let msg = `${i.type.toUpperCase()} ${i.args.join(" ")}\n`;
  document.getElementById("operation").innerText=msg+i.msg;
}

function initRegisters() {
  // the 15 registers
  let regDiv = document.getElementById("registerForm");
  for (let i = 0; i < 16; i++) {
    let regLabel = document.createElement("label");
    let reg = document.createElement("input");
    let regVal = document.createElement("strong");

    regLabel.innerHTML = `Register ${i}`;
    reg.value = "00000000";
    reg.type = "text";
    regVal.innerHTML = "0";
    regDiv.append(regLabel, reg, regVal,document.createElement("br"));
  }

  // the 256 mem registers
  let mem = document.getElementById("memory");
  for (let i = 0; i < 255; i++) {
    let memReg = document.createElement("input");

    memReg.value = "0000000000000000";
    memReg.type = "text";
    mem.appendChild(memReg);
  }

  return true;
}

function reset() {
  registers = document.getElementById("registers").getElementsByTagName("input");
  for(let i=0; i<registers.length;i++) {
    registers[i].value = "00000000";
  }
  let allMem = document.getElementById("memory").getElementsByTagName("input");
  for(let i=0;i<allMem.length;i+=4){
    memory[i/4] = [allMem[i],allMem[i+1],allMem[i+2],allMem[i+3]];
    allMem[i].value = "0000000000000000";
    allMem[i+1].value = "0000000000000000";
    allMem[i+2].value = "0000000000000000";
    allMem[i+3].value = "0000000000000000";
  }
  let strongs = document.getElementsByTagName("strong");
  for(let i=0;i<registers.length;i++){
    strongs[i].innerText=parseInt(registers[i].value,2);
  }
  pc=0;
  instructionRegister = readMem(pc);
  showInstruction(decode(instructionRegister));
  showActive(pc);
}

function stepButton(){
  for(let i=document.getElementById("stepNum").value; i>0;i--){
    instructionRegister = readMem(pc);
    //increasing program counter
    if(++pc>=memory.length*memory[0].length) pc=0;
    //execute the instruction
    execute(decode(instructionRegister));
    //load next instruction
    instructionRegister = readMem(pc);
    showInstruction(decode(instructionRegister));
    showActive(pc);
    let strongs = document.getElementsByTagName("strong");
    for(let i=0;i<registers.length;i++){
      strongs[i].innerText=parseInt(registers[i].value,2);
    }
  }
}

function decode(instruction){
  let opCode = instruction.substring(0,4);
  let rd;
  let rs;
  let imm;
  switch (opCode) {
    case "0001":
    //load
    rd = parseInt(instruction.substring(4, 8), 2);
    rs = parseInt(instruction.substring(8, 16), 2);
      return {
        type: "load",
        args: [rd, rs],
        fun: load,
        msg: `Load mem(${rs}) into r${rd}`
      }
      break;
    case "0010":
      // STORE
      rs = parseInt(instruction.substring(4, 8), 2);
      rd = parseInt(instruction.substring(8, 16), 2);
      return {
        type: "store",
        args: [rs, rd],
        fun: store,
        msg: `Store r${rs} into mem(${rd})`
      }
      break;
      case "0011":
        // ADD
        rd = parseInt(instruction.substring(4, 8), 2);
        rs = parseInt(instruction.substring(8, 12), 2);
        imm = parseInt(instruction.substring(12, 16), 2);
        return {
          type: "add",
          args: [rd, rs, imm],
          fun: add,
          msg: `ADD: r${rd} = r${rs} + r${imm}`
        }
        break;
      case "0100":
        // LOAD Immediate
        rd = parseInt(instruction.substring(4, 8), 2);
        imm = parseInt(instruction.substring(8, 16), 2);
        return {
          type: "li",
          args: [rd, imm],
          fun: li,
          msg: `Load ${imm} into r${rd}`
        }
        break;
      case "0101":
        // JUMP
        imm = parseInt(instruction.substring(4,16), 2);
        return {
          type: "jump",
          args: [imm],
          fun: jump,
          msg: `Jump to mem(${imm})`
        }
        break;
      case "0110":
        // JUMP NOT EQUAL
        imm = parseInt(instruction.substring(4,8), 2);
        rs = parseInt(instruction.substring(8,12), 2);
        rd = parseInt(instruction.substring(12,16), 2);
        return {
          type: "jne",
          args: [imm, rs, rd],
          fun: jne,
          msg: `Jump to mem(${rd}) if r${imm}!=r${rs}`
        }
        break;
      case "0111":
        // SH store high
        rs = parseInt(instruction.substring(4,8), 2);
        rd = parseInt(instruction.substring(8,16), 2);
        return {
          type: "sh",
          args: [rs, rd],
          fun: sh,
          msg: `Store r${rs} into high(mem(${rd}))`
        }
        break;
      case "1000":
        // AND
        rd = parseInt(instruction.substring(4,8), 2);
        rs = parseInt(instruction.substring(8,12), 2);
        imm = parseInt(instruction.substring(12,16), 2);
        return {
          type: "and",
          args: [rd, rs, imm],
          fun: and,
          msg: `AND: r${rd} = r${rs} and r${imm}`
        }
        break;
      case "1001":
        // OR
        rd = parseInt(instruction.substring(4,8), 2);
        rs = parseInt(instruction.substring(8,12), 2);
        imm = parseInt(instruction.substring(12,16), 2);
        return {
          type: "or",
          args: [rd, rs, imm],
          fun: or,
          msg: `OR: r${rd} = r${rs} or r${imm}`
        }
        break;
      default:
      return {
        type: "nop",
        args: [],
        fun: nop,
        msg: `No Operation`
      }
        break;
  }
}

function execute(ins){
  eval(ins.fun(ins.args.shift(),ins.args.shift(),ins.args.shift()));
}
//
// function step() {
//   let rd;
//   let rs;
//   let immediate;
//   instructionRegister = readMem(pc);
//   let opCode = instructionRegister.substring(0,4);
//   switch (opCode) {
//     case "0001":
//       // LOAD
//       rd = parseInt(instructionRegister.substring(4, 8), 2);
//       rs = parseInt(instructionRegister.substring(8, 16), 2);
//       showInstruction("LOAD mem("+rs+") in Register r"+rd);
//       load(rd, rs);
//       break;
//     case "0010":
//       // STORE
//       rs = parseInt(instructionRegister.substring(4, 8), 2);
//       rd = parseInt(instructionRegister.substring(8, 16), 2);
//       showInstruction("STORE Register r"+rs+" in mem("+rd+")");
//       store(rd, rs);
//       break;
//     case "0011":
//       // ADD
//       rd = parseInt(instructionRegister.substring(4, 8), 2);
//       rs = parseInt(instructionRegister.substring(8, 12), 2);
//       immediate = parseInt(instructionRegister.substring(12, 16), 2);
//       showInstruction("ADD r"+rs+" to r"+immediate+" and save to r"+rd);
//       add(rd, rs, immediate);
//       break;
//     case "0100":
//       // LOAD Immediate
//       rd = parseInt(instructionRegister.substring(4, 8), 2);
//       immediate = parseInt(instructionRegister.substring(8, 16), 2);
//       showInstruction("LOAD "+immediate+" into Register r"+rd);
//       registers[rd].value = decToBin(immediate, 8);
//       break;
//     case "0101":
//       // JUMP
//       immediate = parseInt(instructionRegister.substring(4,16), 2);
//       showInstruction("JUMP to mem("+immediate+")");
//       jump(immediate);
//       return;
//       break;
//     case "0110":
//       // JUMP NOT EQUAL
//       rd = parseInt(instructionRegister.substring(4,8), 2);
//       rs = parseInt(instructionRegister.substring(8,12), 2);
//       immediate = parseInt(instructionRegister.substring(12,16), 2);
//       showInstruction("JUMP to mem("+immediate+") if r"+rd+"!= r"+rs);
//       if(registers[rd].value!=registers[rs].value) {
//         jump(immediate);
//         return;
//       }
//       break;
//     default:
//       showInstruction("NOP");
//       break;
//   }
//   //increasing program counter
//   if(++pc>=memory.length*memory[0].length) pc=0;
//   showActive(pc);
//   let strongs = document.getElementsByTagName("strong");
//   for(let i=0;i<registers.length;i++){
//     strongs[i].innerText=parseInt(registers[i].value,2);
//   }
// }

function showActive(pc) {
  for(let i of document.getElementById("memory").getElementsByTagName("input")) {
      if(document.getElementById("memory").getElementsByTagName("input")[pc]===i){
      i.style.backgroundColor ="green";
    }else{
      i.style.backgroundColor ="";
    }
  }
}

function decToBin(dec, limit){
    let ret = (dec >>> 0).toString(2);
    while(ret.length<limit){
      ret = "0"+ret;
    }
    if(ret.length>limit) ret = "00000000";
    return ret;
}

function readFileListener() {
  document.getElementById('compileFile')
      .addEventListener('change', function() {
      let fr=new FileReader();
      fr.onload=function() {
        compileFile(fr.result);
      }
      fr.readAsText(this.files[0]);
  });
}

function encodeFile(data){
  reset();
  let lines = data.split('\r\n');
  for(let i=0;i<memory.length*memory[0].length;i++){
    if(i<lines.length-1){
      memory[parseInt(i/4)][parseInt(i%4)].value = lines[i];
    }
    else{
      memory[parseInt(i/4)][parseInt(i%4)].value = "0000000000000000";
    }
  }
  for(let i=0;i<registers.length;i++){
    registers[i].value="00000000";
  }
  showActive(pc);
  instructionRegister = readMem(pc);
  showInstruction(decode(instructionRegister));
}

function compileFile(data){
  let astGen = new AstGen();
  let compiler = new Compiler();
  let encData = compiler.generate(astGen.generateAst(data));
  encodeFile(encData);
}

function download(filename) {
  let element = document.createElement('a');
  let allMem = document.getElementById("memory").getElementsByTagName("input");
  let text="";
  for(let i=0;i<allMem.length;i++){
    text+=allMem[i].value+"\r\n";
  }
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
