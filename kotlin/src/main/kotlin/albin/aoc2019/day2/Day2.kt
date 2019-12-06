package albin.aoc2019.day2

import albin.aoc2019.intcode.Computer
import java.io.File

fun readData() = File("../data/day2.txt").readText()

fun parseData(s: String) = s
    .split(',')
    .filter(String::isNotBlank)
    .map(String::toInt)


fun runWith(program: List<Int>, noun: Int, verb: Int): Int {
    val prog = program.toMutableList()
    prog[1] = noun
    prog[2] = verb
    val computer = Computer(prog).also { it.run() }
    return computer.program[0]
}

fun part1(program: List<Int>): Int {
    return runWith(program, 12, 2)
}

fun part2(program: List<Int>): Int {
    for (noun in 0..100)
        for (verb in 0..100) {
            val result = runWith(program, noun, verb)
            if (result == 19690720) return 100 * noun + verb
        }
    return -1
}

fun day2() {
    val data = parseData(readData())
    val answer1 = part1(data)
    val answer2 = part2(data)

    println("-- Day 2")
    println("The value in position 0 is $answer1")
    println("The magic combination is $answer2")
}
