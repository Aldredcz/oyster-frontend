// @flow
import React from 'react'
import {Provider} from 'mobx-react'
import projectDetailStore from './core/store'
import ProjectDetail from './components/ProjectDetail'


export default class ProjectDetailWrapper extends React.Component<void, void, void> {
	render () {
		const ProjectDetailAny: any = ProjectDetail

		return (
			<Provider projectDetailStore={projectDetailStore}>
				<ProjectDetailAny />
			</Provider>
		)
	}
}
