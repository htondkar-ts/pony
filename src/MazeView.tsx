import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

enum Wall {
	WEST = 'west',
	NORTH = 'north'
}

type Maze = Array<Wall[]>

interface OwnProps {
	blocks: Maze
	width: number
	height: number
}

export const MazeContainer: React.FunctionComponent<{ mazeId: string }> = props => {
	const [maze, setMaze] = useState<Response | null>(null)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		fetch(`https://ponychallenge.trustpilot.com/pony-challenge/maze/${props.mazeId}`)
			.then(response => response.json())
			.then((jsonResponse: Response) => setMaze(jsonResponse))
			.catch(error => {
				setError(error)
				setMaze(null)
			})
	}, [props.mazeId])

	if (error) {
		console.log(error)
		return <div>Error loading the maze...</div>
	}

	return maze ? (
		<MazeView blocks={maze.data} width={maze.size[0]} height={maze.size[1]}></MazeView>
	) : (
		<div>loading...</div>
	)
}

const MazeView: React.FunctionComponent<OwnProps> = props => {
	const mazeRows = aperture(props.width, props.blocks)
	return (
		<div>
			{mazeRows.map(row => (
				<Row>
					{row.map((walls: Wall[], index) => (
						<MazeBlockView key={index} walls={walls}></MazeBlockView>
					))}
				</Row>
			))}
		</div>
	)
}

const Row = styled.div`
	display: flex;
`

const MazeBlockView = styled.div<{ walls: Wall[] }>`
	width: 30px;
	height: 30px;
	border-style: solid;
	border-width: 2px;
	border-top-color: ${({ walls }) => (hasNorthWall(walls) ? 'black' : 'transparent')};
	border-left-color: ${({ walls }) => (hasWestWall(walls) ? 'black' : 'transparent')};
`

function hasNorthWall(walls: Wall[]): boolean {
	if (walls.length === 0) return false
	return walls.includes(Wall.NORTH)
}

function hasWestWall(walls: Wall[]): boolean {
	if (walls.length === 0) return false
	return walls.includes(Wall.WEST)
}

type Response = {
	pony: [number]
	domokun: [number]
	'end-point': [number]
	size: [number, number]
	difficulty: number
	data: Wall[][]
	maze_id: string
	'game-state': {
		state: string
		'state-result': string
	}
}

function aperture<T>(num: number, arr: T[]): T[][] {
	return [...Array(num)].reduce((ac, _, i) => {
		ac.push(arr.slice(i, num + i))
		return ac
	}, [])
}
