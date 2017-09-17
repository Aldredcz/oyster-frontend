import React from 'react'
import {Provider} from 'mobx-react'
import projectDetailStore from './core/store'
import ProjectDetail from './components/ProjectDetail'

export default class ProjectDetailWrapper extends React.Component {
	render () {
		const ProjectDetailAny = ProjectDetail as any
		const elem = <ProjectDetailAny />
		return (
			<Provider projectDetailStore={projectDetailStore}>
				{elem}
			</Provider>
		)
	}
}
