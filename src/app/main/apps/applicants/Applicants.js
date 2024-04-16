import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getApplicants } from '../service/store/applicantSlice';
import { Link } from 'react-router-dom';
import ApplicantsTable from '../service/stagesForms/applicantDetails/ApplicantsTable';

const Applicants = () => {

  const data = useSelector((state) => {
    return state.applicants;
  })
  console.log(data)

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getApplicants());
  // }, [dispatch]);



  // return<>
  // <h1>This is  Applicants page</h1>
  //     {
  //       data.map((applicant,id) => {
  //           return <li key={id}>
  //            {applicant}
  //       </li>
  //       })
  //     }
  // </>
  return (
    <>
      <h1>This is  Applicants page</h1>
      {/* console.log({data}) */}
      <Link to="/apps/services/steps/trademarks/1">Go to Applicants Table</Link>
      {/* <ApplicantsTable /> */}
      {/* {data.map((applicants,id) => {
        return <li key={id}>
            {applicants}
        </li>
      })} */}
    </>
  )
 }

export default Applicants;
