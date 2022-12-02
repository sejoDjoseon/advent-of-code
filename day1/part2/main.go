package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

func main() {

	f, err := os.Open("./input.txt")
	if err != nil {
		panic(fmt.Sprintf("error get url: %s", err))
	}
	defer f.Close()

	elvesWithMost := [3]int{0, 0, 0}
	currentElveCalories := 0

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()

		if line == "" {
			elvesWithMost = chooseIfMost(currentElveCalories, elvesWithMost)

			currentElveCalories = 0
		} else {
			itemCalorires, err := strconv.Atoi(line)
			if err != nil {
				panic(fmt.Sprintf("err convert string to integer: %s", err))
			}

			currentElveCalories += itemCalorires
		}
	}

	elvesWithMost = chooseIfMost(currentElveCalories, elvesWithMost)

	if err := scanner.Err(); err != nil {
		panic(fmt.Sprintf("err reading file: %s", err))
	}

	fmt.Println("Three Elves with max calories: ", elvesWithMost)

	sum := 0
	for _, elve := range elvesWithMost {
		sum += elve
	}

	fmt.Println("sum of them: ", sum)

}

func chooseIfMost(elve int, elvesMost [3]int) [3]int {
	aux := 0
	for i, em := range elvesMost {
		if elve > em {
			aux = elvesMost[i]
			elvesMost[i] = elve
			elve = aux
		}
	}
	return elvesMost
}
