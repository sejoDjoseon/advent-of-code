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

	maxElveCalories := 0
	currentElveCalories := 0

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()

		if line == "" {
			if currentElveCalories > maxElveCalories {
				maxElveCalories = currentElveCalories
			}

			currentElveCalories = 0
		} else {
			itemCalorires, err := strconv.Atoi(line)
			if err != nil {
				panic(fmt.Sprintf("err convert string to integer: %s", err))
			}

			currentElveCalories += itemCalorires
		}
	}

	if currentElveCalories > maxElveCalories {
		maxElveCalories = currentElveCalories
	}

	if err := scanner.Err(); err != nil {
		panic(fmt.Sprintf("err reading file: %s", err))
	}

	fmt.Println("Elve max calories: ", maxElveCalories)

}
