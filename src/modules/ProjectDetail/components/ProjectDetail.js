// @flow
import React from 'react'
import {Link} from 'react-router-dom'

import type {TProject} from 'core/entities/projects'

import Project from 'core/components/Project/Project'


export default class ProjectDetail extends React.Component<void, TProject, void> {
	render () {
		return (
			<div>
				<p><Link to='/dashboard'>{'<'} Back to dashboard</Link></p>
				<Project uuid={this.props.uuid} />
			</div>
		)
	}
}
