import React from "react";
import { forwardRef, useState } from "react";
import { InputLabelElement, Button, InputFile } from "../index";
import { useDispatch } from "react-redux";
function EditProfileIntro(
  {
    servedTo = "user",
    isUploading,
    closeEditMode,
    EditMode,
    onSubmit,
    error = "",
    client,
  },
  ref
) {
  const [clientData, setClientData] = useState(
    servedTo == "recruiter"
      ? {
          rCompanyName: client.rCompanyName ? client.rCompanyName : "",
          rHeadline: client.rHeadline ? client.rHeadline : "",
          rLocation: client.rLocation ? client.rLocation : "",
          rWebsite: client.rWebsite ? client.rWebsite : "",
          rIndustry: client.rIndustry ? client.rIndustry : "",
          rPhoneNo: client.rPhoneNo ? client.rPhoneNo : "",
          rFoundingYear: client.rFoundingYear ? client.rFoundingYear : "",
          rEmployeeCount: client.rEmployeeCount ? client.rEmployeeCount : "",
        }
      :  {
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        phoneNo: client.phoneNo || "",
        age: client.age || "",
        location: client.location || "",
        headline: client.headline || "",
        resume: client.resume || "",
      }
  );
  const [InfoUpdated, setInfoUpdated] = useState(false);
  const dispatch = useDispatch();
  return (
    <div
      className={`${
        EditMode ? "flex" : "hidden"
      } font-primary  text-white  absolute z-10 left-[50%] p-4 translate-x-[-50%] top-0 min-h-24 w-full max-w-screen-lg `}
    >
      <div className="w-full min-h-24 rounded-lg bg-darkBackground [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ">
        <div className="w-full flex items-center justify-between border-b-[1px] border-b-white p-4">
          <h1 className="text-xl text-white  font-[500] ">Edit Intro</h1>
          <div
            className="w-8 h-8 aspect-square hover:bg-sectionBackground text-white hover:text-darkSection flex items-center justify-center rounded-full "
            onClick={() => {
              console.log(client.basicProfileComplete)
              servedTo == "recruiter"
                ? (client.rBasicProfileComplete
                  ? closeEditMode()
                  : "")
                : (client.basicProfileComplete
                ? closeEditMode()
                : "");
            }}
          >
            <i className="fa-solid fa-close text-2xl "></i>
          </div>
        </div>
        <div className={`w-full text-white px-4 py-1 flex flex-col gap-1`}>
          <p className="text-xs ">* : indicates required</p>
          <div className="w-full flex flex-col gap-6 pt-8 pb-6">
            <div
              className={`rounded w-full text-red-500 border-2 px-2 py-1 border-red-500 ${
                error ? "block" : "hidden"
              }`}
            >
              {error}
            </div>

            {servedTo == "recruiter" ? (
              <div className=" flex flex-col gap-2">
                {client.rVerificationStatus != "verified" ? (
                  <p className="text-green-500 border border-green-500 rounded-md px-2 py-2">
                    Note: if your Verification Status is either{" "}
                    <span className="text-yellow-400">Pending </span> or{" "}
                    <span className="text-red-400">Rejected </span>
                    you will have to update your profile introduction part and
                    wait for upto three business days to get your id verified
                  </p>
                ) : (
                  ""
                )}
                <InputLabelElement
                  type="text"
                  key={"CompanyName"}
                  value={clientData.rCompanyName}
                  label="Company Name:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      rCompanyName: e.target.value,
                    }));
                  }}
                  placeholder="type your Company Name"
                  required
                />
                <InputLabelElement
                  type="text"
                  key={"Headline"}
                  value={clientData.rHeadline}
                  label="Headline:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      rHeadline: e.target.value,
                    }));
                  }}
                  placeholder="type headline here"
                  required
                />
                <InputLabelElement
                  value={clientData.rLocation}
                  key={"Location"}
                  label="Headquarter Location:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      rLocation: e.target.value,
                    }));
                  }}
                  required
                  placeholder="ex. city,state,country"
                />
                <InputLabelElement
                  key={"Website"}
                  type="url"
                  value={clientData.rWebsite}
                  label="Complete Website URL:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      rWebsite: e.target.value,
                    }));
                  }}
                  required
                  placeholder="ex. https://www.jobjet.in"
                />
                <InputLabelElement
                  type="text"
                  key={"Industry"}
                  value={clientData.rIndustry}
                  label="Company Industry:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      rIndustry: e.target.value,
                    }));
                  }}
                  placeholder="ex. Technology & Internet Services "
                  required
                />
                <InputLabelElement
                  type="tel"
                  value={clientData.rPhoneNo}
                  key={"rPhoneno"}
                  label="Company Phone Number:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      rPhoneNo: e.target.value,
                    }));
                  }}
                  placeholder="ex. xxx-xxx-xxxx "
                  pattern="^\d{7,15}$"
                  required
                />
                <InputLabelElement
                  type="number"
                  value={clientData.rFoundingYear}
                  key={"FoundingYear"}
                  label="Company Founding Year:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      rFoundingYear: e.target.value,
                    }));
                  }}
                  placeholder="ex. 1999 "
                  required
                  min={1600}
                  max={new Date().getFullYear()}
                />
                <InputLabelElement
                  type="number"
                  value={clientData.rEmployeeCount}
                  key={"EmployeeCount"}
                  label="Company Employee Count:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      rEmployeeCount: e.target.value,
                    }));
                  }}
                  placeholder="ex. 10"
                  min="2"
                  max="500000"
                  required
                />
                
              </div>
            ) : (
              <div className=" flex flex-col gap-2">
                {/* User Input Section */}
                <InputLabelElement
                  type="text"
                  key={"FirstName"}
                  value={clientData.firstName}
                  label="First Name:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }));
                  }}
                  placeholder="Enter your first name"
                  required
                />
                <InputLabelElement
                  type="text"
                  key={"LastName"}
                  value={clientData.lastName}
                  label="Last Name:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }));
                  }}
                  placeholder="Enter your last name"
                  required
                />
                <InputLabelElement
                  type="tel"
                  key={"PhoneNo"}
                  value={clientData.phoneNo}
                  label="Phone Number:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      phoneNo: e.target.value,
                    }));
                  }}
                  pattern="^\d{7,15}$"
                  placeholder="Enter your phone number"
                  required
                />
                <InputLabelElement
                  type="number"
                  key={"Age"}
                  value={clientData.age}
                  label="Age:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      age: e.target.value,
                    }));
                  }}
                  max={9999999999}
                  min={14}
                  placeholder="Enter your age"
                  required
                />
                <InputLabelElement
                  type="text"
                  key={"location"}
                  value={clientData.location}
                  label="Location:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }));
                  }}
                  max={100}
                  placeholder="Enter your Location"
                />
                <InputLabelElement
                  type="text"
                  key={"Headline"}
                  value={clientData.headline}
                  label="Headline:"
                  mode="dark"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      headline: e.target.value,
                    }));
                  }}
                  placeholder="Enter your headline"
                />
                <InputFile
                  key={"Resume"}
                  label="Upload Resume:(Optional)"
                  accept=".pdf,.doc,.docx"
                  note="Accepted file formats: .pdf, .doc, .docx"
                  onChange={(e) => {
                    setClientData((prev) => ({
                      ...prev,
                      resume: e.target.files[0],
                    }));
                  }}
                />
              </div>
            )}
            <Button
              type="button"
              onClick={async () => {
                setInfoUpdated(false);
                await onSubmit(clientData);
                setInfoUpdated(true);
              }}
              className={`ml-auto w-max py-2 px-5 me-2 mb-2 flex text-[5vw] xs:text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-sectionBackground dark:hover:text-white dark:hover:bg-gray-700 text-wrap `}
            >
              {isUploading ? (
                <>
                  <svg
                    className="mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="font-medium"> Processing... </span>
                </>
              ) : client.rVerificationStatus != "verified" ? (
                "Send For Verfication"
              ) : (
                "Update Information"
              )}
            </Button>
            {InfoUpdated ? (
              <p className="text-green-500">
                Your Information updated successfully
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(EditProfileIntro);
