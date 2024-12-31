import React from "react";
import { AccountOverview, Container, InfoCard } from "../../";
import { useSelector } from "react-redux";
import { getStats } from "../../../utils/admin.utils";
import { getRecruiterInfo } from "../../../utils/admin.utils";
import { useEffect, useState } from "react";

const propertyNames = {
  
  _id:"Recruiter ID",
  rUserName:"Username",
  rCompanyName: "Name",
  rLocation: "Location",
  // specialization: "Specialization",
  rEmail: "Contact Email",
  rPhoneNo: "Phone",
  rWebsite: "Website",
  rFoundingYear: "Founded",
  rEmployeeCount: "Number of Employees",
  logo: "Logo",
  rVerificationStatus: "Verification Status",
  rBasicProfileComplete:"Basic Profile Complete Status"
};

function AdminDashboard() {
  const cardArray = useSelector(
    (state) => state.staticPages.adminPages.AdminDashboard.cardArray
  );
  const [Stats, setStats] = useState([]);
  const [recruiterArray, setRecruiterArray] = useState([]);

  useEffect(() => {
    const updateStats = async () => {
      const response = await getStats();

      setStats(response);
    };
    const updateRecruiterArray = async () => {
      const response = await getRecruiterInfo();
      // console.log(response2);
      setRecruiterArray(response);
    };
    updateStats();
    updateRecruiterArray();
  }, []);

  return (
    <div className="w-full min-h-screen h-full flex flex-col gap-2">
      <Container
        className={`w-half p-[3vw] xs:p-3 min-w-[200px] shadow-md flex flex-col gap-2 h-max sm:p-4 rounded-xl`}
      >
        <h2 className="text-lg xs:text-xl font-primary font-bold text-primary sm:text-2xl">
          Statistics
        </h2>
        <div className="w-full rounded-lg flex h-max flex-wrap justify-start gap-4 ">
          {cardArray.map((card, index) => {
            return (
              <InfoCard
                key={card.text}
                icon={card.icon}
                text={card.text}
                count={Stats[index]}
                color={card.color}
              />
            );
          })}
        </div>
      </Container>
      <Container
        className={`w-half min-w-[200px]  shadow-md flex flex-col gap-2 h-max p-4 px-4 rounded-xl`}
      >
        <h2 className="text-lg xs:text-xl font-primary font-bold text-primary sm:text-2xl">
          Recent Recruiters
        </h2>
        <p className="">click for more details account</p>
        <Container className={`w-half min-w-[200px] p-2 flex flex-col gap-2 h-max px-0 rounded-xl shadow-none transition-all duration-700`}>
          {
            recruiterArray.map(
              (recruiter) => {
                return <AccountOverview key={recruiter.rCompanyName} accountDetails={recruiter} PropertyNameObj={propertyNames} />
              }
            )
          }
        </Container>
      </Container>
    </div>
  );
}

export default AdminDashboard;
