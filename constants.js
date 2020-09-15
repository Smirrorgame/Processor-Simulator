class Constants {

  static Keywords = {
    "nop": {
        code: "0000000000000000",
        args: []
      },
    "load": {
        code: "0001",
        args: [4, 8]
    },
    "store": {
        code: "0010",
        args: [4, 8]
    },
    "add": {
        code: "0011",
        args: [4, 4, 4]
    },
    "li": {
      code: "0100",
      args: [4, 8]
    },
    "jump": {
        code: "0101",
        args: [12]
    },
    "jne": {
        code: "0110",
        args: [4, 4, 4]
    },
    "sh": {
      code: "0111",
      args: [4, 8]
    },
    "and": {
      code: "1000",
      args: [4, 4, 4]
    },
    "or": {
      code: "1001",
      args: [4, 4, 4]
    }
  };

static REGISTERS =
  {
    "r0": 0,
    "r1": 1,
    "r2": 2,
    "r3": 3,
    "r4": 4,
    "r5": 5,
    "r6": 6,
    "r7": 7,
    "r8": 8,
    "r9": 9,
    "r10": 10,
    "r11": 11,
    "r12": 12,
    "r13": 13,
    "r14": 14,
    "r15": 15
  }
}
