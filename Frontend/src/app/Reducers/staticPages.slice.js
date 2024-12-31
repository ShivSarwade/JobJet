import { createSlice } from "@reduxjs/toolkit";
// importing images

import SectionImage from "../../assets/section1-right.png";
import SectionImage2 from "../../assets/section2-left.png";
import Amazon from "../../assets/amazon-logo.png";
import Ajio from "../../assets/Ajio-Logo.png";
import Byjus from "../../assets/Byjus-Logo.png";
import Flipkart from "../../assets/Flipkart-Logo.png";
import Freecharge from "../../assets/Freecharge_logo.png";
import Lenskart from "../../assets/Lenskart-Logo.png";
import NoBroker from "../../assets/noBroker-logo.png";
import SquareYards from "../../assets/square-yards-logo.webp";
import TCS from "../../assets/tcs logo.png";
import Udaan from "../../assets/udaan-logo.png";
import Upgrad from "../../assets/upgrad-logo.png";
import WalMart from "../../assets/walmart_logo.png";
import about_section1 from "../../assets/about_section1.webp";
import about_section2 from "../../assets/about_section2.webp";
import about_section3 from "../../assets/about_section3.webp";
import team_member1 from "../../assets/team_member1.webp";
import team_member2 from "../../assets/team_member2.webp";

const initialState = {
  header: {
    loggedOutUser: [
      {
        path: "/jobs",
        text: "Search Jobs",
        icon: "fa-solid fa-magnifying-glass",
      },
      {
        path: "/feedback-and-rate",
        text: "Feedback and Rate",
        icon: "fa-regular fa-envelope",
      },
      {
        path: "/recruiter/login",
        text: "Recruiters Login",
        icon: "fa-solid fa-user-tie",
      },
      {
        path: "/recruiter/register",
        text: "Recruiters Register",
        icon: "fa-solid fa-user-plus",
      },
      { path: "/about", text: "About Us", icon: "fa-solid fa-circle-info" },
      {
        path: "/terms-and-conditions",
        text: "Terms and Conditions",
        icon: "fa-solid fa-file-invoice",
      },
      {
        path: "/privacy-policy",
        text: "Privacy Policy",
        icon: "fa-solid fa-user-shield",
      },
    ],
    user: [
      { path: ``, text: "Profile", icon: "fa-solid fa-user" },
      {
        path: "/feedback-and-rate",
        text: "Provide Feedback",
        icon: "fa-regular fa-comment",
      },
      {
        path: "/jobs",
        text: "Search Jobs",
        icon: "fa-solid fa-magnifying-glass",
      },
      {
        path: "/feedback-and-rate",
        text: "Feedback and Rate",
        icon: "fa-regular fa-envelope",
      },
      {
        path: "/recruiter/login",
        text: "Recruiters Login",
        icon: "fa-solid fa-user-tie",
      },
      {
        path: "/recruiter/register",
        text: "Recruiters Register",
        icon: "fa-solid fa-user-plus",
      },
      { path: "/about", text: "About Us", icon: "fa-solid fa-circle-info" },
      {
        path: "/terms-and-conditions",
        text: "Terms and Conditions",
        icon: "fa-solid fa-file-invoice",
      },
      {
        path: "/privacy-policy",
        text: "Privacy Policy",
        icon: "fa-solid fa-user-shield",
      },
],
    recruiter: [
      // {
      //   path: "/dashboard",
      //   text: "Recruiter Dashboard",
      //   icon: "fa-solid fa-tachometer-alt",
      // },
      { path: "", text: "Profile", icon: "fa-solid fa-user-tie" },
      {
        path: "/all-jobs",
        text: "Manage Job Postings",
        icon: "fa-solid fa-briefcase",
      },
     
      {
        path: "/search-jobs",
        text: "Search Jobs",
        icon: "fa-solid fa-magnifying-glass",
      },
      {
        path: "/feedback-and-rate",
        text: "Feedback and Rate",
        icon: "fa-regular fa-envelope",
      },
      {
        path: "/login",
        text: "User Login",
        icon: "fa-solid fa-user-tie",
      },
      {
        path: "/register",
        text: "User register",
        icon: "fa-solid fa-user-plus",
      },
      { path: "/about", text: "About Us", icon: "fa-solid fa-circle-info" },
      {
        path: "/terms-and-conditions",
        text: "Terms and Conditions",
        icon: "fa-solid fa-file-invoice",
      },
      {
        path: "/privacy-policy",
        text: "Privacy Policy",
        icon: "fa-solid fa-user-shield",
      },
    ],
  },
  footer: [
    {
      category: "Product",
      links: [
        { text: "About Us", href: "/about" },
        { text: "Search Jobs", href: "/jobs" },
        { text: "Recruiter Login", href: "/recruiter/login" },
        { text: "Recruiter Register", href: "/recruiter/register" },
      ],
    },
    {
      category: "Useful Links",
      links: [
        { text: "Feedback and Rate", href: "/feedback-and-rate" },
        { text: "Report a Fraud", href: "/report-a-fraud" },
        { text: "Sitemap", href: "/sitemap" },
        { text: "FAQ", href: "/faq" },  
      ],
    },
    {
      category: "Security",
      links: [
        { text: "Privacy Policy", href: "/privacy-policy" },
        { text: "Terms and Conditions", href: "/terms-and-conditions" },
        { text: "Request a Feature", href: "/request-a-feature" },
        { text: "Report a Bug", href: "/report-a-bug" },
      ],
    },
  ],
  homePage: {
    TwoSideSectionData: [
      {
        direction: "row",
        heading: "JetPack your Career with",
        headingSpan: "JobJet",
        tagline: "ACCELERATE... ASCEND... ACHIEVE!",
        buttonText: "Sign Up Now !!",
        redirectTo: "/register",
        image: SectionImage,
      },
      {
        direction: "row-reverese",
        heading: "Having hard time finding skilled ",
        headingSpan: "Employees?",
        tagline: "Discover Top Talent on JobJet!",
        buttonText: "Post Your Job Now!!",
        redirectTo: "/recruiter/register",
        image: SectionImage2,
      },
    ],
    RecruitmentPartnerSectionData: {
      RecruitmentSectionHeading: {
        heading1: "More than 5000",
        heading2: "trusts",
        span: "Recruiters",
        brand: "JobJet",
      },
      RecruiterArray: [
        { name: "Amazon", src: Amazon, website: "https://www.amazon.com" },
        { name: "Ajio", src: Ajio, website: "https://www.ajio.com" },
        { name: "Byjus", src: Byjus, website: "https://www.byjus.com" },
        {
          name: "Flipkart",
          src: Flipkart,
          website: "https://www.flipkart.com",
        },
        {
          name: "Freecharge",
          src: Freecharge,
          website: "https://www.freecharge.in",
        },
        {
          name: "Lenskart",
          src: Lenskart,
          website: "https://www.lenskart.com",
        },
        { name: "NoBroker", src: NoBroker, website: "https://www.nobroker.in" },
        {
          name: "Square Yards",
          src: SquareYards,
          website: "https://www.squareyards.com",
        },
        { name: "TCS", src: TCS, website: "https://www.tcs.com" },
        { name: "Udaan", src: Udaan, website: "https://www.udaan.com" },
        { name: "Upgrad", src: Upgrad, website: "https://www.upgrad.com" },
        { name: "WalMart", src: WalMart, website: "https://www.walmart.com" },
      ],
    },
  },
  aboutUsPage: {
    aboutSections: [
      {
        title: "About Jobjet",
        description:
          "Welcome to JobJet, your premier destination for finding the perfect job or ideal candidate. We understand that the right career opportunity can transform lives and drive business success. Our mission is to bridge the gap between talented individuals and top-notch employers, facilitating meaningful connections that pave the way for mutual growth and success.",
        image: about_section1,
        alt: "logo1",
        flexDirection: "flex-row", // Adjust as needed (e.g., "flex-row-reverse")
      },
      {
        title: "Our Leadership",
        description:
          "At JobJet, we are guided by a team of visionary leaders who bring a wealth of experience and expertise to the table. Our leadership is committed to innovation, integrity, and excellence, driving our mission forward with passion and dedication.",
        image: about_section2,
        alt: "logo2",
        flexDirection: "flex-row-reverse", // Adjust as needed
      },
      {
        title: "Ensuring Security and Trust",
        description:
          "At Job Jet, we prioritize your security. Every job listing is meticulously verified by our team to safeguard user data and financial security. By manually reviewing each posting, we actively prevent fraud and maintain the integrity of our platform, ensuring a safe environment for all users. Your trust is our commitment.",
        image: about_section3,
        alt: "logo3",
        flexDirection: "flex-row", // Adjust as needed
      },
    ],
    teamMembers: [
      {
        name: "Shiv Sarwade",
        role: "Developer",
        image: team_member1,
      },
      {
        name: "Atharva Sonawane",
        role: "Developer",
        image: team_member2,
      },
    ],
  },
  adminPages: {
    AdminDashboard: {
      cardArray: [
        {
          icon: "fa-solid fa-users",
          text: "Total Users",
          count: 980,
          color: "red",
        },
        {
          icon: "fa-solid fa-building",
          text: "Total Companies",
          count: 25,
          color: "blue",
        },
        {
          icon: "fa-solid fa-chart-line",
          text: "Total Jobs ",
          count: 120,
          color: "green",
        },
      ],
      recruiterArray : [
        {
          name: "Google",
          location: "Mountain View, California, USA",
          specialization: "Search Engine, Cloud Computing, AI",
          contactEmail: "contact@google.com",
          phone: "+1-650-253-0000",
          website: "https://www.google.com",
          founded: 1998,
          numberOfEmployees: 156500,
          logo: "https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723939200&semt=ais_hybrid",
          status: "public"
        },
        {
          name: "Microsoft",
          location: "Redmond, Washington, USA",
          specialization: "Software, Cloud Computing, AI",
          contactEmail: "contact@microsoft.com",
          phone: "+1-425-882-8080",
          website: "https://www.microsoft.com",
          founded: 1975,
          numberOfEmployees: 221000,
          logo: "https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723939200&semt=ais_hybrid",
          status: "public"
        },
        {
          name: "Apple",
          location: "Cupertino, California, USA",
          specialization: "Consumer Electronics, Software, Services",
          contactEmail: "contact@apple.com",
          phone: "+1-408-996-1010",
          website: "https://www.apple.com",
          founded: 1976,
          numberOfEmployees: 164000,
          logo: "https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723939200&semt=ais_hybrid",
          status: "public"
        },
        {
          name: "Facebook (Meta)",
          location: "Menlo Park, California, USA",
          specialization: "Social Media, Virtual Reality, AI",
          contactEmail: "contact@meta.com",
          phone: "+1-650-543-4800",
          website: "https://www.meta.com",
          founded: 2004,
          numberOfEmployees: 86000,
          logo: "https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723939200&semt=ais_hybrid",
          status: "public"
        },
        {
          name: "Amazon",
          location: "Seattle, Washington, USA",
          specialization: "E-commerce, Cloud Computing, AI",
          contactEmail: "contact@amazon.com",
          phone: "+1-206-266-1000",
          website: "https://www.amazon.com",
          founded: 1994,
          numberOfEmployees: 1541000,
          logo: "https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723939200&semt=ais_hybrid",
          status: "public"
        },
        {
          name: "Netflix",
          location: "Los Gatos, California, USA",
          specialization: "Streaming Services, Entertainment",
          contactEmail: "contact@netflix.com",
          phone: "+1-408-540-3700",
          website: "https://www.netflix.com",
          founded: 1997,
          numberOfEmployees: 12500,
          logo: "https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723939200&semt=ais_hybrid",
          status: "public"
        }
      ]
      
    },
  },
  sitemap: [
    {
      path: "/",
      title: "Static Pages",
      children: [
        {
          path: "",
          title: "Home",
        },
        {
          path: "about",
          title: "About Us",
        },
        {
          path: "careers",
          title: "Careers",
        },
        {
          path: "sitemap",
          title: "Sitemap",
        },
      ],
    },
    {
      path: "/",
      title: "Help and Support",
      children: [
        {
          path: "faq",
          title: "FAQ",
        },
        {
          path: "report-a-fraud",
          title: "Report a Fraud",
        },
        {
          path: "report-a-bug",
          title: "Report a Bug",
        },
        {
          path: "feedback-and-rate",
          title: "Feedback and Rate",
        },
        {
          path: "request-a-feature",
          title: "Request a Feature",
        },
      ],
    },
    {
      path: "/",
      title: "Our Policies",
      children: [
        {
          path: "terms-and-conditions",
          title: "Terms and Conditions",
        },
        {
          path: "privacy-policy",
          title: "Privacy Policy",
        },
      ],
    },
    {
      path: "/",
      title: "User",
      children: [
        {
          path: "",
          title: "User Profile",
        },
        {
          path: "jobs",
          title: "User Jobs",
        },
      ],
    },
    {
      path: "/recruiter",
      title: "Recruiter",
      children: [
        {
          path: "",
          title: "Recruiter Profile",
        },
      ],
    },
    {
      path: "/admin",
      title: "Admin",
      children: [
        {
          path: "",
          title: "Admin Dashboard",
        },
        {
          path: "profile",
          title: "Admin Profile",
        },
        {
          path: "users",
          title: "Admin Users",
        },
        {
          path: "recruiters",
          title: "Admin Recruiters",
        },
      ],
    },
  ],
};

export const StaticPagesSlice = createSlice({
  name: "StaticPages",
  initialState,
  reducers: {
    addSection: () => {},
  },
});

export const { addSection } = StaticPagesSlice.actions;

export default StaticPagesSlice.reducer;
