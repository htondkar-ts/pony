import { MovementRestriction } from './MovementRestriction'
import { Stack } from './utils'

export type Wall = 'west' | 'north'

export type MazeData = Array<Wall[]>

export class MazeModel {
	movementRestrictions: MovementRestriction

	constructor(
		private readonly mazeData: MazeData,
		private readonly rowsCount: number,
		private readonly columnsCount: number
	) {
		this.movementRestrictions = new MovementRestriction(mazeData, columnsCount, rowsCount)
	}

	public findPathToGoal(startPointIndex: number, goalIndex: number) {
		const walkedPath: number[] = []
		const visited: number[] = []

		const stack = new Stack<number>()
		stack.push(startPointIndex)

		while (true) {
			const currentBlock = stack.pop()

			if (!currentBlock) {
				break
			}

			walkedPath.push(currentBlock)
			visited.push(currentBlock)

			if (currentBlock === goalIndex) {
				break
			}

			let unVisited = 0

			const walkableAdjBlocks = this.getAdjWalkableBlocks(currentBlock)

			walkableAdjBlocks.forEach(blockIndex => {
				if (!visited.includes(blockIndex)) {
					stack.push(blockIndex)
					unVisited++
				}
			})

			if (unVisited === 0) {
				stack.pop()
			}
		}

		return walkedPath
	}

	getAdjWalkableBlocks(startPointIndex: number) {
		const result: number[] = []

		if (this.movementRestrictions.canMoveNorth(startPointIndex)) {
			result.push(startPointIndex - this.columnsCount)
		}

		if (this.movementRestrictions.canMoveWest(startPointIndex)) {
			result.push(startPointIndex - 1)
		}

		if (this.movementRestrictions.canMoveEast(startPointIndex)) {
			result.push(startPointIndex + 1)
		}

		if (this.movementRestrictions.canMoveSouth(startPointIndex)) {
			result.push(startPointIndex + this.columnsCount)
		}

		return result
	}
}
