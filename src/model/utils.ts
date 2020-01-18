export class Stack<T> {
	container: T[]

	constructor(private readonly maxSize: number = Infinity) {
		this.container = []
	}

	// A method just to see the contents while we develop this class
	toString() {
		return this.container.toString()
	}

	// Checking if the array is empty
	isEmpty() {
		return this.container.length === 0
	}

	// Check if array is full
	isFull() {
		return this.container.length >= this.maxSize
	}

	push(value: T) {
		this.container.push(value)
	}

	pop() {
		if (this.container.length === 0) {
			return undefined
		}

		return this.container.pop()
	}
}
