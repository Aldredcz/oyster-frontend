import React from 'react'
import {observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import {TDashboardStore} from '../core/store'

import {projectFactory} from 'core/components/Project/Project'

import Link from 'core/router/Link'
import Box from 'libs/box'
import Ico from 'core/components/ui/Ico'
import Text from 'core/components/ui/Text'

const Project = projectFactory({
	titleRenderer: (title, self) =>	(
		<Box>
			{React.cloneElement(title, {
				module: 'projectDetail',
				params: {projectUuid: self.props.project.uuid},
				as: Link,
				asBoxBasedComponent: true,
				block: false,
				display: 'inline-block',
			})}
		</Box>
	),
	projectManagerSelectRenderer: () => null,
})

type TProps = {
	dashboardStore: TDashboardStore,
}

type TAddNewProjectButtonProps = {
	onClick: () => void,
	isCreating: boolean,
}

@observer
class AddNewProjectButton extends React.Component<TAddNewProjectButtonProps> {
	@observable isHover: boolean = false

	render () {
		const {onClick, isCreating} = this.props

		return (
			<Box
				onClick={onClick}
				onMouseEnter={() => this.isHover = true}
				onMouseLeave={() => this.isHover = false}
				zIndex={1}
				height={2.5}
				backgroundColor='blue'
				borderRadius={100}
				cursor='pointer'
				position='fixed'
				bottom={1.5}
				right={1.5}
			>
				<Ico
					type={!isCreating ? 'plus' : 'spinner'}
					spin={isCreating}
					height='100%'
					width='auto'
					padding={0.5}
					color='white'
					style={() => ({
						float: 'left',
					})}
				/>
				{(this.isHover || isCreating) && (
					<Text
						textSize='13'
						color='white'
						paddingRight={0.8}
						style={() => ({
							lineHeight: '2.5rem',
						})}
					>
						{!isCreating
							? 'Add project'
							: 'Creating...'
						}
					</Text>
				)}
			</Box>
		)
	}
}

@inject('dashboardStore') @observer
export default class Dashboard extends React.Component<TProps> {
	createNewProject = () => {
		this.props.dashboardStore.createNewProject()
	}

	render () {
		const {dashboardStore: {projects, ui}} = this.props

		return (
			<Box>
				{projects && (
					<Box>
						{projects.length === 0 && 'No projects!'}
						{projects.map((project, i) => (
							<Box key={project.data.uuid} marginTop={i !== 0 ? 2.5 : 0}>
								<Project uuid={project.data.uuid} />
							</Box>
						))}
					</Box>
				)}
				<AddNewProjectButton
					onClick={this.createNewProject}
					isCreating={ui.creatingNewProject}
				/>
			</Box>
		)
	}
}
