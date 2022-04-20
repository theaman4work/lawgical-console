import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useDeepCompareEffect } from '@fuse/hooks';
import { memo, useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FuseLoading from '@fuse/core/FuseLoading';
import { axiosInstance } from 'app/auth-service/axiosInstance';

const useStyles = makeStyles(theme => ({
	productImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	productImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	}
}));

const defaultValues = {
	poa: undefined,
	msmeCert: undefined,
	userAff: undefined,
	evdOfUse: undefined
};

const schema = yup.object().shape({
	poa: yup.mixed().nullable(),
	msmeCert: yup.mixed().nullable(),
	userAff: yup.mixed().nullable(),
	evdOfUse: yup.mixed().nullable(),
	salesFigure: yup.mixed().nullable(),
	marketingDetail: yup.mixed().nullable(),
	otherDoc: yup.mixed().nullable()
});

const CpUploadDocuments = props => {
    const classes = useStyles();
	const serviceSteps = useSelector(({ servicesApp }) => servicesApp.serviceSteps);

	const [messageAndLevel, setMessageAndLevel] = useState({
		message: '',
		level: 'error',
		open: false
	});

	const [poaUpload, setPoaUpload] = useState(null);
	const [questionaire, setQuestionaire] = useState(null);
	const [copyrightwork, setCopyrightWork] = useState(null);
	const [applicantSign, setApplicantSign] = useState(null);
	const [authorNOC, setAuthorNOC] = useState(null);
	const [letterAuth, setLetterAuth] = useState(null);
	const [artisticWork, setArtisticWork] = useState(null);
	const [loading, setLoading] = useState(true);

	const { control, reset, handleSubmit, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

    return (
        <div className="flex-grow flex-shrink-0 p-0">
			<div>
				<div>
					<Typography className="text-16 sm:text-20 truncate font-semibold">
						{`Step ${props.stepCount} - ${props.step.name}`}
					</Typography>
					<Collapse in={messageAndLevel.open}>
						<Alert
							severity={messageAndLevel.level}
							variant="outlined"
							className="mt-10"
							action={
								<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={event => handleClose(event)}
								>
									<CloseIcon fontSize="inherit" />
								</IconButton>
							}
						>
							{messageAndLevel.message}
						</Alert>
					</Collapse>
					<form className="justify-items-center mb-20 mt-20" >
					{[1, 2].includes(props.copyrightServiceUploadType) && (
							<>
						<div className="flex justify-center items-center pt-20" /*onSubmit={handleSubmit(onSubmit)}*/>
							<Controller
								name="poa"
								control={control}
								defaultValue={[]}
								required
								render={({ field: { name, onChange } }) => (
									<Button
										variant="contained"
										className="w-1/2"
										component="label"
										color="primary"
										startIcon={<CloudUploadIcon />}
									>
										Power Of Authorization*
										<input
											accept="application/pdf"
											className="hidden"
											id="poa-file"
											name="poa"
											type="file"
											onChange={async e => {
												const reader = new FileReader();
												const file = e.target.files[0];

												reader.onloadend = () => {
													setPoaUpload(file);
												};
												if (file instanceof Blob) {
													reader.readAsDataURL(file);
												}
											}}
										/>
									</Button>
								)}
							/>
						</div>
						<div className="flex justify-center items-center pt-1">
									{poaUpload ? (
										<Typography className="mb-16" component="p">
											{poaUpload.url && !poaUpload.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={poaUpload.url ? poaUpload.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{poaUpload.name ? poaUpload.name : ''}
												</Link>
											) : poaUpload.name ? (
												poaUpload.name
											) : (
												''
											)}
										</Typography>
									) : (
										''
									)}
						</div>
						</>
						)}
						
						{props.copyrightServiceUploadType === 1 && (	
							<>			
								<div className="flex justify-center items-center pt-20" /*onSubmit={handleSubmit(onSubmit)}*/>
									<Controller
										name="questionaire"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Questionaire Form*
												<input
													accept="application/pdf"
													className="hidden"
													id="questionaire-file"
													name="questionaire"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setQuestionaire(file);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										)}
									/>
								</div>
								<div className="flex justify-center items-center pt-1">
											{questionaire ? (
												<Typography className="mb-16" component="p">
													{questionaire.url && !questionaire.url.includes('data:application') ? (
														<Link
															color="primary"
															underline="always"
															target="_blank"
															href={questionaire.url ? questionaire.url : '#'}
															style={{ textDecoration: 'none' }}
														>
															{questionaire.name ? questionaire.name : ''}
														</Link>
													) : questionaire.name ? (
														questionaire.name
													) : (
														''
													)}
												</Typography>
											) : (
												''
											)}
								</div>

								<div className="flex justify-center items-center pt-20" /*onSubmit={handleSubmit(onSubmit)}*/>
									<Controller
										name="copyrightwork"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Copyight work*
												<input
													accept="application/pdf"
													className="hidden"
													id="copyrightwork-file"
													name="copyrightwork"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setCopyrightWork(file);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										)}
									/>
								</div>
								<div className="flex justify-center items-center pt-1">
											{copyrightwork ? (
												<Typography className="mb-16" component="p">
													{copyrightwork.url && !copyrightwork.url.includes('data:application') ? (
														<Link
															color="primary"
															underline="always"
															target="_blank"
															href={copyrightwork.url ? copyrightwork.url : '#'}
															style={{ textDecoration: 'none' }}
														>
															{copyrightwork.name ? copyrightwork.name : ''}
														</Link>
													) : copyrightwork.name ? (
														copyrightwork.name
													) : (
														''
													)}
												</Typography>
											) : (
												''
											)}
								</div>

								<div className="flex justify-center items-center pt-20">
											<Controller
												name="applicantSign"
												control={control}
												defaultValue={[]}
												required
												render={({ field: { name, onChange } }) => (
													<Button
														variant="contained"
														className="w-1/2"
														component="label"
														color="primary"
														startIcon={<CloudUploadIcon />}
													>
														Upload applicant sinature*
														<input
															accept="application/pdf"
															className="hidden"
															id="applicantSign-file"
															name="applicantSign"
															type="file"
															onChange={async e => {
																const reader = new FileReader();
																const file = e.target.files[0];

																reader.onloadend = () => {
																	setApplicantSign(file);
																};
																if (file instanceof Blob) {
																	reader.readAsDataURL(file);
																}
															}}
														/>
													</Button>
												)}
											/>
										</div>
										<div className="flex justify-center items-center pt-1">
											{applicantSign ? (
												<Typography className="mb-16" component="p">
													{applicantSign.url && !applicantSign.url.includes('data:application') ? (
														<Link
															color="primary"
															underline="always"
															target="_blank"
															href={applicantSign.url ? applicantSign.url : '#'}
															style={{ textDecoration: 'none' }}
														>
															{applicantSign.name ? applicantSign.name : ''}
														</Link>
													) : applicantSign.name ? (
														applicantSign.name
													) : (
														''
													)}
												</Typography>
											) : (
												''
											)}
								</div>

								<div className="flex justify-center items-center pt-20">
											<Controller
												name="authorNOC"
												control={control}
												defaultValue={[]}
												required
												render={({ field: { name, onChange } }) => (
													<Button
														variant="contained"
														className="w-1/2"
														component="label"
														color="primary"
														startIcon={<CloudUploadIcon />}
													>
														Author NOC
														<input
															accept="application/pdf"
															className="hidden"
															id="authorNOC-file"
															name="authorNOC"
															type="file"
															onChange={async e => {
																const reader = new FileReader();
																const file = e.target.files[0];

																reader.onloadend = () => {
																	setAuthorNOC(file);
																};
																if (file instanceof Blob) {
																	reader.readAsDataURL(file);
																}
															}}
														/>
													</Button>
												)}
											/>
										</div>
										<div className="flex justify-center items-center pt-1">
											{authorNOC ? (
												<Typography className="mb-16" component="p">
													{authorNOC.url && !authorNOC.url.includes('data:application') ? (
														<Link
															color="primary"
															underline="always"
															target="_blank"
															href={authorNOC.url ? authorNOC.url : '#'}
															style={{ textDecoration: 'none' }}
														>
															{authorNOC.name ? authorNOC.name : ''}
														</Link>
													) : authorNOC.name ? (
														authorNOC.name
													) : (
														''
													)}
												</Typography>
											) : (
												''
											)}
								</div>

								<div className="flex justify-center items-center pt-20">
											<Controller
												name="letterAuth"
												control={control}
												defaultValue={[]}
												required
												render={({ field: { name, onChange } }) => (
													<Button
														variant="contained"
														className="w-1/2"
														component="label"
														color="primary"
														startIcon={<CloudUploadIcon />}
													>
														Letter of Authorization
														<input
															accept="application/pdf"
															className="hidden"
															id="letterAuth-file"
															name="letterAuth"
															type="file"
															onChange={async e => {
																const reader = new FileReader();
																const file = e.target.files[0];

																reader.onloadend = () => {
																	setLetterAuth(file);
																};
																if (file instanceof Blob) {
																	reader.readAsDataURL(file);
																}
															}}
														/>
													</Button>
												)}
											/>
										</div>
										<div className="flex justify-center items-center pt-1">
											{letterAuth ? (
												<Typography className="mb-16" component="p">
													{letterAuth.url && !letterAuth.url.includes('data:application') ? (
														<Link
															color="primary"
															underline="always"
															target="_blank"
															href={letterAuth.url ? letterAuth.url : '#'}
															style={{ textDecoration: 'none' }}
														>
															{letterAuth.name ? letterAuth.name : ''}
														</Link>
													) : letterAuth.name ? (
														letterAuth.name
													) : (
														''
													)}
												</Typography>
											) : (
												''
											)}
								</div>
							</>
						)}

						{(props.copyrightServiceUploadType === 2) && (
							<>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="artisticWork"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Upload Artistic Work
												<input
													accept="application/pdf"
													className="hidden"
													id="artisticWork-file"
													name="artisticWork"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setArtisticWork(file);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										)}
									/>
								</div>
								<div className="flex justify-center items-center pt-1">
									{artisticWork ? (
										<Typography className="mb-16" component="p">
											{artisticWork.url && !artisticWork.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={artisticWork.url ? artisticWork.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{artisticWork.name ? artisticWork.name : ''}
												</Link>
											) : artisticWork.name ? (
												artisticWork.name
											) : (
												''
											)}
										</Typography>
									) : (
										''
									)}
								</div>
							</>
						)}

						<Button
							type="submit"
							variant="contained"
							color="primary"
							className="w-full mx-auto mt-16"
							aria-label="Submit"
							value="legacy"
						>
							Submit
						</Button>
					
					</form>
				</div>
			</div>
		</div>
    );
};

export default memo(CpUploadDocuments);