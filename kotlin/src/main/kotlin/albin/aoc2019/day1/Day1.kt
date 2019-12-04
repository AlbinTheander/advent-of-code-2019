package albin.aoc2019.day1

import java.io.File
import kotlin.math.max

fun readData() = File("../data/day1.txt").readText()

fun parseData(s: String) = s
    .split('\n')
    .filter(String::isNotBlank)
    .map(String::toInt)

fun fuelNeeded(weight: Int): Int = max(weight / 3 - 2, 0)

fun totalFuelNeeded(weight: Int): Int {
    val fuel = fuelNeeded(weight)
    if (fuel == 0) return 0
    return fuel + totalFuelNeeded((fuel))
}

fun part1(weights: List<Int>) = weights.map(::fuelNeeded).reduce(Integer::sum)

fun part2(weights: List<Int>) = weights.map(::totalFuelNeeded).reduce(Integer::sum)

fun day1() {
    val data = parseData(readData());
    val answer1 = part1(data)
    val answer2 = part2(data)
    println("-- Day 1");
    println("The total amount of fuel is $answer1")
    println("The correct amount of fuel is $answer2")
}