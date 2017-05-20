// @flow
import React from 'react'
import {Provider} from 'mobx-react'
import projectDetailStore from './core/store'
import ProjectDetail from './components/ProjectDetail'
;(ProjectDetail: any)

export default class ProjectDetailWrapper extends React.Component<void, void, void> {
	render () {
		//$FlowFixMe
		const elem = <ProjectDetail/>
		return (
			<Provider projectDetailStore={projectDetailStore}>
				{elem}
			</Provider>
		)
	}
}
