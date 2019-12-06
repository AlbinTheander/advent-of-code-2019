package albin.aoc2019.day5

import albin.aoc2019.intcode.Computer
import java.io.File

fun readData() = File("../data/day5.txt").readText()

fun parseData(s: String) = s
    .split(',')
    .filter(String::isNotBlank)
    .map(String::toInt)

fun part1(program: List<Int>): Int {
    val computer = Computer(program.toMutableList(), listOf(1))
    computer.run()
    return computer.output.last()
}

fun part2(program: List<Int>): Int {
    val computer = Computer(program.toMutableList(), listOf(5))
    computer.run()
    return computer.output.last()
}

fun day5() {
    val data = parseData(readData())
    val answer1 = part1(data)
    val answer2 = part2(data)

    println("-- Day 5")
    println("The diagnostic code for the air conditioning is $answer1")
    println("The diagnostic code for the answer2 thermal radiators is $answer2")
}