package albin.aoc2019.intcode

const val POSITION = 0
const val IMMEDIATE = 1

const val ADD = 1
const val MUL = 2
const val HALT = 99

class Computer(val program: MutableList<Int>, val input: List<Int> = emptyList()) {
    val output: List<Int> = mutableListOf()
    var ip = 0
    var halted = false

    fun read(mode: Int): Int {
        val n = program[ip++]
        return if (mode == IMMEDIATE) n else program[n]
    }

    private fun getOp(instr: Int) = instr % 100;

    private fun getModifier(instr: Int, pos: Int): Int =
        if (pos > -2) getModifier(instr / 10, pos - 1) else instr % 10

    fun step() {
        val instr = read(IMMEDIATE);
        val op = getOp(instr)

        when (op) {
            ADD -> {
                val a = read(getModifier(instr, 0))
                val b = read(getModifier(instr, 1))
                val c = read(IMMEDIATE)
                program[c] = a + b
            }
            MUL -> {
                val a = read(getModifier(instr, 0))
                val b = read(getModifier(instr, 1))
                val c = read(IMMEDIATE)
                program[c] = a * b
            }
            HALT -> {
                halted = true
            }
        }
    }

    fun run() {
        while(!halted) step()
    }
}