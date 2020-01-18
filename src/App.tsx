import React from 'react'
import { MazeContainer } from './MazeView'
import styled from 'styled-components'

const App: React.FC = () => {
	return (
		<AppWrapper>
			<MazeContainer mazeId="1484644e-9bd4-409f-b50c-14583258d686"></MazeContainer>
		</AppWrapper>
	)
}

const AppWrapper = styled.div`
	display: flex;
`

export default App
