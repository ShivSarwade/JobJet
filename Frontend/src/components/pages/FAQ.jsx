import React, { useId } from "react";
import {FaqsElement} from "../index";
function Faq({
 faqs=[
    {
        "question": "How do I create a JobJet account?",
        "answer": "To create a JobJet account, click on the 'Sign Up' button at the top-right corner of our homepage. You will need to provide your email address, create a password, and fill out your profile information. After submitting the form, you will receive a confirmation email. Click the link in the email to activate your account."
    },
    {
        "question": "How can I apply for a job?",
        "answer": "Once you’ve logged into your JobJet account, use the search bar to find jobs that match your interests. Click on a job listing to view details. To apply, click the 'Apply Now' button. You may be required to upload your resume and cover letter or fill out an application form, depending on the employer’s requirements."
    },
    {
        "question": "How do I update my profile information?",
        "answer": "Log in to your JobJet account and navigate to your profile by clicking on your name or profile picture at the top-right corner. Select 'Edit Profile' to update your personal information, work experience, and skills. Don’t forget to save your changes before leaving the page."
    },
    {
        "question": "How can employers post job listings?",
        "answer": "Employers can post job listings by logging into their JobJet employer account. Click on the 'Post a Job' button, fill out the job details, and submit the listing for review. Once approved, your job listing will be live on the JobJet website and visible to job seekers."
    },
    {
        "question": "What should I do if I forget my password?",
        "answer": "On the login page, click on the 'Forgot Password' link. Enter your registered email address, and you will receive an email with instructions to reset your password. Follow the link in the email to create a new password and regain access to your account."
    },
    {
        "question": "How do I contact JobJet support?",
        "answer": "If you need assistance, please visit our 'Contact Us' page or email our support team at support@jobjet.com. You can also reach out to us via our social media channels or use the live chat feature available on our website for immediate support."
    }
]


}){
   return(
    <> 
    <div className="w-full h-max bg-white"></div> 
    <div className=" max-[450px]:p-[4vw] p-8 max-w-[900px] m-auto ">
        <div className="flex flex-col">
           {faqs.map((key)=>
              <FaqsElement key={useId() } faq={key} /> 
           )}
           </div>
           </div>
        
    </>
   ) 
}
 export default Faq