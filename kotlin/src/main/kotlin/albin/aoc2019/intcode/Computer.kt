package albin.aoc2019.intcode

const val POSITION = 0
const val IMMEDIATE = 1

const val ADD = 1
const val MUL = 2
const val IN = 3
const val OUT = 4
const val JT = 5
const val JF = 6
const val LT = 7
const val EQ = 8
const val HALT = 99

class Computer(val program: MutableList<Int>, val input: List<Int> = emptyList()) {
    val output: MutableList<Int> = mutableListOf()
    var ip = 0
    var inp = 0
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
            IN -> {
                val a = read(IMMEDIATE)
                program[a] = input[inp++]
            }
            OUT -> {
                val a = read(getModifier(instr, 0))
                output.add(a)
            }
            JT -> {
                val a = read(getModifier(instr, 0))
                val b = read(getModifier(instr, 1))
                if (a != 0) ip = b
            }
            JF -> {
                val a = read(getModifier(instr, 0))
                val b = read(getModifier(instr, 1))
                if (a == 0) ip = b
            }
            LT -> {
                val a = read(getModifier(instr, 0))
                val b = read(getModifier(instr, 1))
                val c = read(IMMEDIATE)
                program[c] = if (a < b) 1 else 0
            }
            EQ -> {
                val a = read(getModifier(instr, 0))
                val b = read(getModifier(instr, 1))
                val c = read(IMMEDIATE)
                program[c] = if (a == b) 1 else 0
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