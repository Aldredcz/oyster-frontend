// @flow
import projectDetailStore from './store/index'

const routes = {
	'/:projectUuid': {
		'/task/:selectedTaskUuid': {
			on: () => {
				// function below is called in cascade, no need to do anything here
			},
		},
		on: (projectUuid: string, selectedTaskUuid: string) => {
			projectDetailStore.setData({projectUuid, selectedTaskUuid})
		},
	},
}

export default routes
