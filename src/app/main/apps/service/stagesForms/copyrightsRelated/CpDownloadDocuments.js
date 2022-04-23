import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { useDeepCompareEffect } from '@fuse/hooks';
import { memo, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { GetApp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FuseLoading from '@fuse/core/FuseLoading';
import { axiosInstance } from 'app/auth-service/axiosInstance';
import { updateData } from '../../store/serviceStepsSlice';


const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

const CpDownloadDocuments = props => {

	const classes = useStyles();

	return (
		<div className="flex-grow flex-shrink-0 p-0">
			<div>
				<div>
					<Typography className="text-16 sm:text-20 truncate font-semibold">
						{`Step ${props.stepCount} - ${props.step.name}`}
					</Typography>
					{(
						<>
							{<Divider className="mt-20" />}
							<div className="mt-20 w-full flex items-center justify-center">
								<FuseScrollbars className="flex-grow overflow-x-auto">
									<Table
										stickyHeader
										className={classes.table}
										size="small"
										aria-labelledby="tableTitle"
									>
										<TableHead>
											<TableRow>
												<TableCell>Document</TableCell>
												<TableCell>Link</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{props.stage.poaDraftUrl && (
												<TableRow
													className="h-36 cursor-pointer"
													hover
													tabIndex={-1}
													key={props.stage.poaDraftUrl.substr(
														props.stage.poaDraftUrl.length - 4
													)}
												>
													<TableCell component="th" scope="row">
														POA Draft
													</TableCell>
													<TableCell
														align="center"
														className="w-52 px-4 md:px-0"
														padding="none"
														component="th"
														scope="row"
													>
														<GetApp
															color="primary"
															className={classes.largeIcon}
															onClick={() =>
																window.open(props.stage.poaDraftUrl, '_self')
															}
														/>
													</TableCell>
												</TableRow>
											)}
											{props.stage.questionnaireFormUrl && (
												<TableRow
													className="h-36 cursor-pointer"
													hover
													tabIndex={-1}
													key={props.stage.questionnaireFormUrl.substr(
														props.stage.questionnaireFormUrl.length - 4
													)}
												>
													<TableCell component="th" scope="row">
														Questionaire Form
													</TableCell>
													<TableCell
														align="center"
														className="w-52 px-4 md:px-0"
														padding="none"
														component="th"
														scope="row"
													>
														<GetApp
															color="primary"
															className={classes.largeIcon}
															onClick={() =>
																window.open(props.stage.questionnaireFormUrl, '_self')
															}
														/>
													</TableCell>
												</TableRow>
											)}
											{props.stage.nocDraftUrl ? (
												<TableRow
													className="h-36 cursor-pointer"
													hover
													tabIndex={-1}
													key={props.stage.nocDraftUrl.substr(
														props.stage.nocDraftUrl.length - 4
													)}
												>
													<TableCell component="th" scope="row">
														NOC Draft
													</TableCell>
													<TableCell
														align="center"
														className="w-52 px-4 md:px-0"
														padding="none"
														component="th"
														scope="row"
													>
														<GetApp
															color="primary"
															className={classes.largeIcon}
															onClick={() =>
																window.open(props.stage.nocDraftUrl, '_self')
															}
														/>
													</TableCell>
												</TableRow>
											) : null}
										</TableBody>
									</Table>
								</FuseScrollbars>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);

};

export default memo(CpDownloadDocuments);