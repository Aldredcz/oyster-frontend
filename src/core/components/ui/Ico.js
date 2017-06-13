// @flow
import React from 'react'
import PropTypes from 'prop-types'
import type {TColor, TTheme} from 'core/config/themes/types'
import type {TBoxProps} from 'libs/box'

import Box from 'libs/box'


// INTERNAL
import LogoSvg from 'assets/images/logo.svg'
// import AddSvg from 'assets/images/icons/O_icon_add.svg'
// import AddBigSvg from 'assets/images/icons/O_icon_add_big.svg'
// import AddProjectSvg from 'assets/images/icons/O_icon_add_project.svg'
// import Add_smallSvg from 'assets/images/icons/O_icon_add_small.svg'
// import ArchiveSvg from 'assets/images/icons/O_icon_archive.svg'
// import Arrow_LSvg from 'assets/images/icons/O_icon_arrow_L.svg'
// import Arrow_RSvg from 'assets/images/icons/O_icon_arrow_R.svg'
// import BoxSvg from 'assets/images/icons/O_icon_box.svg'
// import CalendarSvg from 'assets/images/icons/O_icon_calendar.svg'
// import ClockSvg from 'assets/images/icons/O_icon_clock.svg'
import ClockFullSvg from 'assets/images/icons/O_icon_clock-full.svg'
// import DeleteSvg from 'assets/images/icons/O_icon_delete.svg'
// import DriveSvg from 'assets/images/icons/O_icon_drive.svg'
// import DropboxSvg from 'assets/images/icons/O_icon_dropbox.svg'
// import EditSvg from 'assets/images/icons/O_icon_edit.svg'
// import HamburgerSvg from 'assets/images/icons/O_icon_hamburger.svg'
// import HelpSvg from 'assets/images/icons/O_icon_help.svg'
// import LogoutSvg from 'assets/images/icons/O_icon_logout.svg'
// import NotebookSvg from 'assets/images/icons/O_icon_notebook.svg'
import NotificationSvg from 'assets/images/icons/O_icon_notification.svg'
// import OnedriveSvg from 'assets/images/icons/O_icon_onedrive.svg'
// import PersonalsetingsSvg from 'assets/images/icons/O_icon_personalsetings.svg'
// import PhoneSvg from 'assets/images/icons/O_icon_phone.svg'
// import PrioritiesSvg from 'assets/images/icons/O_icon_priorities.svg'
import ProjectsSvg from 'assets/images/icons/O_icon_projects.svg'
// import RemoveSvg from 'assets/images/icons/O_icon_remove.svg'
// import SearchSvg from 'assets/images/icons/O_icon_search.svg'
// import SettingsSvg from 'assets/images/icons/O_icon_settings.svg'
// import SmileSvg from 'assets/images/icons/O_icon_smile.svg'
// import TabletSvg from 'assets/images/icons/O_icon_tablet.svg'
import OkSvg from 'assets/images/icons/O_icon_ok.svg'
import OkFullSvg from 'assets/images/icons/O_icon_ok-full.svg'

// FA
import UndoSvg from 'font-awesome-svg-png/black/svg/undo.svg'

const icoMap = {
	logo: LogoSvg,
	projects: ProjectsSvg,
	notification: NotificationSvg,
	clockFull: ClockFullSvg,
	ok: OkSvg,
	okFull: OkFullSvg,
	undo: UndoSvg,
}

export type TIcoType = $Keys<typeof icoMap>

export type TProps = TBoxProps & {
	type: TIcoType,
	width?: number | string,
	height?: number | string,
	color?: TColor,
}

type TContext = {
	theme: TTheme,
}

const defaultIcoSize = '1em'

export default class Ico extends React.Component<void, TProps, void> {
	static contextTypes = {
		theme: PropTypes.object,
	}
	context: TContext

	render () {
		const {
			type,
			width,
			height,
			color,
			...restProps
		} = this.props

		const {theme} = this.context

		const colorResolved = theme.colors[color || 'neutralDark']

		const Svg = icoMap[type]
		return (
			<Box
				{...restProps}
				as={Svg}
				width={width || height || defaultIcoSize}
				height={height || width || defaultIcoSize}
				fill={colorResolved}
			/>
		)
	}
}

