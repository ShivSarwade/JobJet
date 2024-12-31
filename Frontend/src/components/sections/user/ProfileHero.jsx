import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MaleAvatar from "../../../assets/male avatar.svg";
import BannerImg from "../../../assets/banner.png";
import Company from "../../../assets/CompanyAvatar.png";
import { logInRecruiter } from "../../../app/Reducers/recruiter.slice";
import { Link, useParams } from "react-router-dom";
import { logInUser } from "../../../app/Reducers/user.slice";
import ExperienceSection from "./ExperienceSection";

import {
  AboutCompany,
  Button,
  EducationSection,
  Loader,
  SkillsSection,
} from "../../index";

import {
  bannerUploadRecruiter,
  avatarUploadRecruiter,
  editProfileIntroduction,
  getRecruiterProfile,
} from "../../../utils/recruiter.utils";

import {
  EditProfileIntro,
  PhotoUploadSection,
  PostedJobRecruiterProfileSection,
} from "../../index";

import {
  getUser,
  avatarUploadUser,
  bannerUploadUser,
  updateProfile,
} from "../../../utils/user.utils";

function ProfileHero({
  servedTo = "user",
  isEditable = false,
  presentingTo = "recruiter",
}) {
  const [Loading, setLoading] = useState(true);
  const { recruiterusername, username } = useParams();
  const UserData = useSelector((state) => state.user.userData);
  const RecruiterData = useSelector((state) => state.recruiter.recruiterData);
  const dispatch = useDispatch();
  const client = servedTo === "user" ? UserData : RecruiterData;
  const [clientData, setClientData] = useState(client);
  const [EditProfileIntroMode, setEditProfileIntroMode] = useState(false);
  const [BannerEditMode, setBannerEditMode] = useState(false);
  const [AvatarEditMode, setAvatarEditMode] = useState(false);
  const [SelectedBanner, setSelectedBanner] = useState("");
  const [SelectedAvatar, setSelectedAvatar] = useState("");
  const [Avatar, setAvatar] = useState(Company);
  const [Banner, setBanner] = useState(BannerImg);
  const [BannerError, setBannerError] = useState();
  const [InfoUpdated, setInfoUpdated] = useState(false);
  const [AvatarError, setAvatarError] = useState();
  const [EditProfileError, setEditProfileError] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoadingError, setDataLoadingError] = useState(false);

  const CloseEditProfileMode = () => {
    setEditProfileIntroMode(
      servedTo == "recruiter"
        ? clientData.rBasicProfileComplete
          ? false
          : true
        : clientData.basicProfileComplete
        ? false
        : true
    );
  };
  // Handle file download for resume
  const downloadFile = (cloudinaryPdfUrl) => {
    console.log("Original Cloudinary URL:", cloudinaryPdfUrl);

    // Ensure the URL uses HTTPS
    if (!cloudinaryPdfUrl.startsWith("https://")) {
      cloudinaryPdfUrl = cloudinaryPdfUrl.replace("http://", "https://");
    }

    // Check if the URL contains a version number like 'v1732510099'
    const versionPattern = /\/v\d+/;
    let downloadUrl = cloudinaryPdfUrl;

    if (versionPattern.test(cloudinaryPdfUrl)) {
      // Replace the version number with 'fl_attachment'
      downloadUrl = cloudinaryPdfUrl.replace(versionPattern, "/fl_attachment");
      console.log(
        "Download URL after replacing version with fl_attachment:",
        downloadUrl
      );
    } else if (cloudinaryPdfUrl.includes("/upload/")) {
      // If the URL contains '/upload/', add 'fl_attachment' after it
      downloadUrl = cloudinaryPdfUrl.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
    }

    // Ensure the URL is still using HTTPS
    if (!downloadUrl.startsWith("https://")) {
      downloadUrl = downloadUrl.replace("http://", "https://");
    }

    // Extract the filename from the URL (after the last '/')
    const filename = `${
      clientData.firstName + "-" + clientData.lastName
    }.resume`;

    // Create a temporary link and simulate the download
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Set the download attribute to the extracted filename
    link.download = filename;

    // Simulate the download by clicking the link
    link.click();
  };

  const handleBannerUpload = async () => {
    setIsUploading(true);
    if (SelectedBanner) {
      const response =
        servedTo == "user"
          ? await bannerUploadUser(SelectedBanner)
          : await bannerUploadRecruiter(SelectedBanner);
      setIsUploading(false);
      if (response.error) {
        setBannerError(response.error);
      } else {
        servedTo == "user"
          ? dispatch(logInUser(response))
          : dispatch(logInRecruiter(response));
        setBanner(response.banner || BannerImg);
      }
    }
    setBannerEditMode(false);
  };

  const handleAvatarUpload = async () => {
    setIsUploading(true);
    if (SelectedAvatar) {
      const response =
        servedTo == "user"
          ? await avatarUploadUser(SelectedAvatar)
          : await avatarUploadRecruiter(SelectedAvatar);
      setIsUploading(false);
      if (response.error) {
        setAvatarError(response.error);
      } else {
        servedTo == "user"
          ? dispatch(logInUser(response))
          : dispatch(logInRecruiter(response));
        setAvatar(response.avatar || Company);
      }
    }
    setAvatarEditMode(false);
  };

  const handleUpdateIntro = async (profileIntro) => {
    setIsUploading(true);
    setInfoUpdated(false);
    if (profileIntro) {
      console.log(profileIntro);
      const response =
        servedTo == "recruiter"
          ? await editProfileIntroduction(profileIntro)
          : await updateProfile(profileIntro);
      setIsUploading(false);
      if (response.error) {
        setEditProfileError(response.error);
      } else {
        servedTo == "recruiter"
          ? dispatch(logInRecruiter(response))
          : dispatch(logInUser(response));
        setInfoUpdated(true);
      }
    }
  };

  const showPreviewBanner = (e) => {
    const file = e.target.files?.[0];
    setSelectedBanner(file ? file : undefined);
  };

  const showPreviewAvatar = (e) => {
    const file = e.target.files?.[0];
    setSelectedAvatar(file ? file : undefined);
  };

  useEffect(() => {
    const fetchRecruiterData = async () => {
      setClientData(client);

      setLoading(true);
      try {
        setEditProfileIntroMode(false);
        // Check if we need to fetch data
        if (
          servedTo === "recruiter" &&
          recruiterusername !== client.rUserName
        ) {
          const response = await getRecruiterProfile(recruiterusername);
          if (response.error) {
            setDataLoadingError(true);
          } else {
            setClientData(response);
            setAvatar(response.avatar || Company);
            setBanner(response.banner || BannerImg);
          }
        } else {
          // Set client data from the existing user data
          // Check if the profile is complete
          if (client.rBasicProfileComplete == false) {
            setEditProfileIntroMode(true);
          } else {
            setEditProfileIntroMode(false); // Ensure this is set to false if complete
          }
          setAvatar(client.avatar || Company);
          setBanner(client.banner || BannerImg);
        }
      } catch (error) {
        setDataLoadingError(true);
        console.error("Error fetching recruiter data:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchUserData = async () => {
      setClientData(client);
      setLoading(true);
      try {
        setEditProfileIntroMode(false);
        if (servedTo === "user" && username !== client.username) {
          console.log(username);

          const response = await getUser(username);
          if (response.error) {
            setDataLoadingError(true);
          } else {
            setClientData(response);
            setAvatar(response.avatar || Company);
            setBanner(response.banner || BannerImg);
          }
        } else {
          // Set client data from the existing user data
          setClientData(client);
          setAvatar(client.avatar || MaleAvatar);
          setBanner(client.banner || BannerImg);
        }
      } catch (error) {
        setDataLoadingError(true);
        console.error("Error fetching recruiter data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (servedTo === "user") {
      fetchUserData();
    } else {
      fetchRecruiterData();
    }
  }, [servedTo, recruiterusername, client]); // Include client to trigger effect on data change

  return Loading ? (
    <Loader />
  ) : (
    <div className="relative w-full h-max min-h-sectionHeight bg-sectionBackground">
      <div className="w-full h-full min-h-sectionHeight font-primary flex flex-col gap-2 items-center py-4 px-2 sm:px-4 relative">
        <div className="w-full h-max lg:max-w-screen-lg rounded-lg overflow-hidden bg-white">
          <div className="w-full relative mb-[15vw] xs:mb-[12vw] sm:mb-[10vw] md:mb-[7vw] lg:mb-20 bg-white">
            <div className="w-full aspect-[1450/350] flex items-center justify-center max-w-full max-h-[60vh] overflow-hidden">
              <img
                src={Banner}
                className="w-full h-max object-cover"
                alt="Banner"
              />
              <div
                className={`${
                  isEditable ? "flex" : "hidden"
                } absolute bottom-0 right-0 w-8 m-2 flex items-center justify-center aspect-square rounded-full bg-white border-2 border-primary text-primary`}
                onClick={() => {
                  setBannerEditMode(true);
                }}
              >
                <i className="fa-solid fa-pen-to-square text-[14px]"></i>
              </div>
            </div>

            <div
              className={`absolute bottom-0 translate-y-[50%] md:translate-y-[40%]  ${
                servedTo === "user" ? "rounded-full overflow-hidden " : ""
              }  left-4 border-4 aspect-square w-[30%] sm:w-1/4 md:w-1/5 `}
              onClick={() => {
                isEditable ? setAvatarEditMode(true) : "";
              }}
            >
              <div className="relative w-full h-full group overflow-hidden  ">
                <img
                  src={Avatar}
                  className="w-full h-full object-cover "
                  alt="Avatar"
                />
                <div
                  className={`${
                    isEditable ? "flex backdrop-blur-md" : "hidden"
                  } ${
                    servedTo == "user" ? "rounded-full" : ""
                  } transition-all duration-1000 w-full h-full flex items-center justify-center text-bold text-md absolute z-10 backdrop-blur-none group-hover:backdrop-blur-md  text-primary left-0 top-0`}
                >
                  <i className="transition-all duration-300 hidden group-hover:block fa-solid fa-upload border-2 border-primary p-2 aspect-square rounded-full bg-white"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-max px-[5vw] py-[2vw] xs:px-4 xs:py-4 md:pt-2 flex flex-col gap-1">
            <h1 className="text-[6vw] xs:text-xl sm:text-[1.5rem] capitalize font-[600] pt-2">
              {servedTo === "user"
                ? clientData.firstName + " " + clientData.lastName
                : clientData.rCompanyName}
            </h1>
            <h3 className="text-[4vw] xs:text-sm sm:text-[1rem] capitalize font-[400]">
              {servedTo === "user"
                ? clientData.headline
                : clientData.rHeadline
                ? clientData.rHeadline
                : "no headline available"}
            </h3>
            <h3 className="text-[4vw] xs:text-xs capitalize font-[400] text-gray-400 pb-2">
              {servedTo === "user"
                ? clientData.location
                : clientData.rLocation
                ? clientData.rLocation
                : "no location available"}
            </h3>
            {servedTo == "user" && clientData.phoneNo ? (
              <div className="text-[4vw] xs:text-xs capitalize font-[400] text-primary pb-2 flex gap-2 ">
                <i className="fa-solid fa-phone"></i>
                {clientData.phoneNo}
              </div>
            ) : (
              ""
            )}

            {servedTo !== "user" && clientData.rWebsite ? (
              <Link
                className="text-[4vw] xs:text-sm sm:text-[1rem] capitalize font-[400] text-primary hover:text-accent flex gap-1"
                to={clientData.rWebsite}
              >
                Visit Our Website
                <i className="fa-solid fa-link text-sm pb-2"></i>
              </Link>
            ) : servedTo === "user" && clientData.resume ? (
              <a
                className="text-[4vw] xs:text-sm sm:text-[1rem] capitalize font-[400] text-primary hover:text-accent flex gap-1"
                onClick={() => {
                  if(isEditable==false){
                    downloadFile(clientData.resume)}}
                  }
              >
                Download my resume
                <i className="fa-solid fa-link text-sm pb-2"></i>
              </a>
            ) : (
              ""
            )}

            {servedTo == "user" && clientData.age ? (
              <h3 className="text-[4vw] xs:text-xs capitalize font-[400] text-black pb-2">
                Age {clientData.age}
              </h3>
            ) : (
              ""
            )}
            <div className="w-full flex justify-between flex-wrap gap-y-2">
              {servedTo == "recruiter" ? (
                <div
                  className={`text-[4vw] xs:text-sm sm:text-[1rem] flex rounded-full px-2 items-center justify-center w-max border-2 border-dashed py-0 gap-1 ${
                    clientData.rVerificationStatus === "verified"
                      ? "border-green-500 text-green-500"
                      : clientData.rVerificationStatus === "rejected"
                      ? "border-red-500 text-red-500"
                      : "border-yellow-500 text-yellow-500"
                  }`}
                >
                  <i className="fa-regular fa-circle-check"></i>
                  {clientData.rVerificationStatus === "verified"
                    ? "Verified Recruiter"
                    : clientData.rVerificationStatus === "rejected"
                    ? "Unverified Recruiter"
                    : "Pending Verification"}
                </div>
              ) : (
                ""
              )}

              {isEditable ? (
                <Button
                  className="text-[4vw] ml-auto xs:text-sm sm:text-[1rem] bg-blue-200 text-blue-800 px-2 py-1 flex gap-1 items-center justify-between rounded-md hover:bg-darkSection hover:text-white transition-all duration-300 "
                  onClick={() => {
                    setEditProfileIntroMode(true);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                  Edit Intro
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div
          className={
            servedTo === "user"
              ? "w-full h-max lg:max-w-screen-lg rounded-lg overflow-hidden min-h-24 bg-white"
              : "hidden"
          }
        >
          <SkillsSection
            isEditable={isEditable}
            userSkills={clientData.skills}
          />
        </div>
        <div
          className={
            servedTo === "user"
              ? "w-full h-max lg:max-w-screen-lg rounded-lg overflow-hidden min-h-24 bg-white"
              : "hidden"
          }
        >
          <ExperienceSection
            isEditable={isEditable}
            userExperience={clientData.experience}
          />
        </div>
        <div
          className={
            servedTo === "user"
              ? "w-full h-max lg:max-w-screen-lg rounded-lg overflow-hidden min-h-24 bg-white"
              : "hidden"
          }
        >
          <EducationSection
            isEditable={isEditable}
            userEducation={clientData.education}
          />
        </div>

        <div className="w-full h-max lg:max-w-screen-lg rounded-lg overflow-hidden min-h-24 bg-white">
          {servedTo == "user" ? (
            <AboutCompany
              servedTo={servedTo}
              isEditable={isEditable}
              value={clientData.about}
            />
          ) : (
            <AboutCompany
              servedTo={servedTo}
              isEditable={isEditable}
              value={clientData.rOverview}
            />
          )}
        </div>

        <div
          className={
            servedTo === "recruiter"
              ? "w-full h-max lg:max-w-screen-lg rounded-lg overflow-hidden min-h-24 bg-white"
              : "hidden"
          }
        >
          <PostedJobRecruiterProfileSection
            servedTo={servedTo}
            isEditable={isEditable}
            recruiterData={clientData}
            presentingTo={presentingTo}
          />
        </div>
      </div>

      <PhotoUploadSection
        isServedToUser={servedTo === "user"}
        PreviewAspect={"1450/350"}
        key="banner"
        error={BannerError}
        SelectedImage={SelectedBanner}
        onSubmit={handleBannerUpload}
        closeEditMode={() => {
          setBannerEditMode(false);
        }}
        isUploading={isUploading}
        EditMode={BannerEditMode}
        InputObj={{
          label: "Upload Banner Image",
          note: "Image should be of resolution 1400/350 for best results",
          accept: ".png, .jpeg, .jpg",
          onChange: showPreviewBanner,
        }}
      />

      <PhotoUploadSection
        isServedToUser={servedTo === "user"}
        PreviewAspect={"1/1"}
        key="avatar"
        error={AvatarError}
        SelectedImage={SelectedAvatar}
        onSubmit={handleAvatarUpload}
        closeEditMode={() => {
          setAvatarEditMode(false);
        }}
        isUploading={isUploading}
        EditMode={AvatarEditMode}
        InputObj={{
          label: "Upload Profile Photo",
          note: "Image should be of aspect ratio 1/1 for the best results",
          accept: ".png,.jpeg, .jpg",
          onChange: showPreviewAvatar,
        }}
      />

      <EditProfileIntro
        servedTo={servedTo}
        isUploading={isUploading}
        closeEditMode={CloseEditProfileMode}
        EditMode={EditProfileIntroMode}
        onSubmit={(obj) => {
          handleUpdateIntro(obj);
        }}
        client={clientData}
        error={EditProfileError}
        InfoUpdated={InfoUpdated}
      />
    </div>
  );
}

export default ProfileHero;
