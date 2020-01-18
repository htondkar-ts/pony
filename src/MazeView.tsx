import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { MovementRestriction } from './model/MovementRestriction'
import { MazeData, Wall, MazeModel } from './model/Model'

interface OwnProps {
	blocks: MazeData
	width: number
	height: number
	ponyIndex: number
	domokunIndex: number
	goal: number
	pathToGoal: number[]
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

	const pathToGoal = maze
		? new MazeModel(maze.data, maze.size[0], maze.size[1]).findPathToGoal(
				maze.pony[0],
				maze['end-point'][0]
		  )
		: []

	return maze ? (
		<MazeView
			blocks={maze.data}
			width={maze.size[0]}
			height={maze.size[1]}
			ponyIndex={maze.pony[0]}
			domokunIndex={maze.domokun[0]}
			goal={maze['end-point'][0]}
			pathToGoal={pathToGoal}
		></MazeView>
	) : (
		<div>loading...</div>
	)
}

const MazeView: React.FunctionComponent<OwnProps> = props => {
	return (
		<MazeWrapper columns={props.width} rows={props.height}>
			{props.blocks.map((block, blockIndex) => (
				<MazeBlockView
					key={blockIndex}
					walls={block}
					blockIndex={blockIndex}
					className={`${props.pathToGoal.includes(blockIndex) && 'path-to-goal'} ${
						hasNorthWall(block) ? 'north' : ''
					} ${hasWestWall(block) ? 'west' : ''}`}
				>
					{blockIndex === props.domokunIndex && <Domokun>👹</Domokun>}
					{blockIndex === props.ponyIndex && <Pony>🦄</Pony>}
					{blockIndex === props.goal && <Goal>🏁</Goal>}
					<span>{blockIndex}</span>
				</MazeBlockView>
			))}
		</MazeWrapper>
	)
}

const Goal = styled.div`
	font-size: 22px;
`

const Pony = styled.div`
	font-size: 22px;
`

const Domokun = styled.div`
	font-size: 22px;
`

const MazeWrapper = styled.div<{ rows?: number; columns?: number }>`
	border-right: 1px solid black;
	border-bottom: 1px solid black;
	display: grid;
	grid-template-columns: ${props => `repeat(${props.columns}, 1fr)`};
	grid-template-rows: ${props => `repeat(${props.rows}, 1fr)`};
`

const MazeBlockView = styled.div<{ walls: Wall[]; blockIndex: number }>`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 50px;
	height: 50px;
	position: relative;
`

function hasNorthWall(walls: Wall[]): boolean {
	if (walls.length === 0) return false
	const hasNorthWall = walls.includes('north')

	return hasNorthWall
}

function hasWestWall(walls: Wall[]): boolean {
	if (walls.length === 0) return false
	const hasWestWall = walls.includes('west')

	return hasWestWall
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
