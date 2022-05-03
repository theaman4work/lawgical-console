import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import { makeStyles } from '@material-ui/core/styles';
import { memo, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { GetApp } from '@material-ui/icons';
import { axiosInstance } from 'app/auth-service/axiosInstance';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

const CpDownloadDocuments = props => {
	const classes = useStyles();
	/* const [stateLserviceStageTransactionId, setStateLserviceStageTransactionId] = useState(null);

	useEffect(() => {
		if (props.pricingInfoStatus === 0 && props.lserviceTransaction.id !== null) {
			if (props.lserviceStageTransaction == null) {
				const data = {
					lserviceTransactionId: props.lserviceTransaction.id,
					stageStatus: 'INPROGRESS',
					lserviceStageId: props.step.id,
					lserviceId: props.step.lserviceId
				};

				axiosInstance
					.post('/services/lgrest/api/lservice-stage-transactions/create-transaction-for-customer', {
						email: localStorage.getItem('lg_logged_in_email'),
						...data
					})
					.then(res => {
						setStateLserviceStageTransactionId(res.data.lserviceStageTransactionDTO.id);
					});
			}
		}
	}, [
		props.step.id,
		props.step.lserviceId,
		props.lserviceStageTransaction,
		props.lserviceTransaction,
		props.pricingInfoStatus
	]); */

	return (
		<div className="flex-grow flex-shrink-0 p-0">
			<div>
				<div>
					<Typography className="text-16 sm:text-20 truncate font-semibold">
						{`Step ${props.stepCount} - ${props.step.name}`}
					</Typography>
					<>
						<Divider className="mt-20" />
						<div className="mt-20 w-full flex items-center justify-center">
							<FuseScrollbars className="flex-grow overflow-x-auto">
								<Table stickyHeader className={classes.table} size="small" aria-labelledby="tableTitle">
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
												key={props.stage.poaDraftUrl.substr(props.stage.poaDraftUrl.length - 4)}
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
														onClick={() => window.open(props.stage.poaDraftUrl, '_self')}
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
													props.stage.questionnaireFormUrl.length - 5
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
												key={props.stage.nocDraftUrl.substr(props.stage.nocDraftUrl.length - 6)}
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
														onClick={() => window.open(props.stage.nocDraftUrl, '_self')}
													/>
												</TableCell>
											</TableRow>
										) : null}
									</TableBody>
								</Table>
							</FuseScrollbars>
						</div>
					</>
				</div>
			</div>
		</div>
	);
};

export default memo(CpDownloadDocuments);
