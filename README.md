
# Processor-Simulator

This Simulator simulates a Processor with registers and memory.

The registers are 16 in total, with each a length of 8 bits.
The memory consists of 256 registers, each with a length of 16 bits.

### Coming Features
- [ ] Reference branches which are declared after the reference
- [ ] more assembly instructions
- [ ] more feature ideas

## How To

### Upload Assembly Code
You can upload an assembly file which will be parsed and compiled to the machine code and inserted to the program memory. (CRLF line endings)
### Step Through Program
You can step through the program memory by clicking the step button.
To do more than one step, you can increase the number on the left of the button and then click step.
### Reset Program
You can reset all by clicking the reset button. Note: memory and registers are being reseted, so you have to re-upload your assembly.asm file
### Examples
#### Assembly
```
# This program multiplies r0=21 with r1=5, saves
# it to r2 and stores it in memory at address 10
SETUP:
li r0 21
li r1 5
li r2 0
li r3 0
li r4 1

LOOP:
add r2 r2 r0
add r3 r3 r4
jne r3 r1 LOOP

END:
store r2 0b00001010
jump END
```
### Allowed Assebly Instructions
|Instruction| Meaning |
|--|--|
| nop | no/empty operation |
| load rd imm| load mem(imm) into register rd |
| li rd imm| load imm into register rd |
| store rs imm| store register rs into mem(imm) |
| ~~sl rs imm~~| ~~store register rs into mem(imm) manipulating only bit 8 to 16~~ |
| sh rs imm| store register rs into mem(imm) manipulating only bit 0 to 7 |
| add rd rs1 rs2| adds rs1 to rs2 and save it to rd |
| and rd rs1 rs2| bitwise and rs1 with rs2 and save it to rd |
| or rd rs1 rs2| bitwise or rs1 with rs2 and save it to rd |
|BRANCHNAME:| creates a new branch at posistion where it was declared. Must be in capital and with colon |
| jump imm/BRANCHNAME| jump to imm/BRANCHNAME |
| jne rs1 rs2 imm/BRANCHNAME| jump to imm/BRANCHNAME if rs1 not equal to rs2 |
| # comment | a comment in the code |
