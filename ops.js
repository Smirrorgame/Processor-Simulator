/* 
 * @author: Micha Halla
 
 * Contains the specific functions for
 * all known assembly instructions
 */


function load(rd, imm) {
  registers[rd].value = readMem(imm).substring(8,16);
}

function store(rs, rd) {
  memory[parseInt(rd/4)][parseInt(rd%4)].value = "00000000"+registers[rs].value;
  // sl(rs, rd);
}

function sl(rs, rd) {
  let mem = memory[parseInt(rd/4)][parseInt(rd%4)].value;
  memory[parseInt(rd/4)][parseInt(rd%4)].value = mem.substring(0,8)+registers[rs].value;
}

function sh(rs, rd) {
  let mem = memory[parseInt(rd/4)][parseInt(rd%4)].value;
  memory[parseInt(rd/4)][parseInt(rd%4)].value = registers[rs].value+mem.substring(8,16);
}

function and(rd, rs, imm){
  registers[rd].value = decToBin(parseInt(registers[rs].value, 2)&parseInt(registers[imm].value, 2), 8);
}

function or(rd, rs, imm){
  registers[rd].value = decToBin(parseInt(registers[rs].value, 2)|parseInt(registers[imm].value, 2), 8);
}

function add(rd, rs, imm){
  registers[rd].value = decToBin(parseInt(registers[rs].value,2) + parseInt(registers[imm].value,2), 8);
}

function li(rd, imm){
    registers[rd].value = decToBin(imm, 8);
}
function nop (){}

function jump(adress) {
   pc = adress;
}

function jne(a, b, c){
  if(registers[a].value!=registers[b].value) {
    jump(c);
  }
}

function readMem(adress) {
  return memory[parseInt(adress/4)][parseInt(adress%4)].value;
}
