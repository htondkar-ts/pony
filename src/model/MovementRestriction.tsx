import { Wall, MazeData } from './Model'

export class MovementRestriction {
	static readonly walkableDirections = ['west', 'north', 'east', 'south'] as const

	constructor(
		private readonly maze: MazeData,
		private readonly columnsCount: number,
		private readonly rowsCount: number
	) {}

	public canMoveWest(currentIndex: number): boolean {
		// at the west border
		if (this.blockIsOnFirstColumn(currentIndex)) {
			return false
		}

		if (this.hasWall('west', this.maze[currentIndex])) {
			return false
		}

		return true
	}

	public canMoveNorth(currentIndex: number): boolean {
		// at the north border
		if (this.blockIsOnFirstRow(currentIndex)) {
			return false
		}

		if (this.hasWall('north', this.maze[currentIndex])) {
			return false
		}

		return true
	}

	public canMoveEast(currentIndex: number): boolean {
		// at the east border
		if (this.blockIsOnLastColumn(currentIndex)) {
			return false
		}

		if (this.hasWall('west', this.maze[currentIndex + 1])) {
			return false
		}

		return true
	}

	public canMoveSouth(currentIndex: number): boolean {
		// at the south border
		if (this.blockIsOnLastRow(currentIndex)) {
			return false
		}

		if (this.hasWall('north', this.maze[currentIndex + this.columnsCount])) {
			return false
		}

		return true
	}

	private blockIsOnLastRow(blockIndex: number) {
		return blockIndex + 1 > (this.rowsCount - 1) * this.columnsCount
	}

	private blockIsOnFirstRow(blockIndex: number) {
		return blockIndex + 1 < this.columnsCount
	}

	private blockIsOnLastColumn(blockIndex: number) {
		return (blockIndex + 1) % this.columnsCount === 0
	}

	private blockIsOnFirstColumn(blockIndex: number) {
		if (blockIndex === 0) return true
		return blockIndex % this.columnsCount === 0
	}

	private hasWall(type: Wall, walls: Wall[]): boolean {
		return walls.includes(type)
	}
}
