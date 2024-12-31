import React,{useState} from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Sitemap = () => {
  const sitemap = useSelector(state => state.staticPages.sitemap)
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className="container mx-auto min-h-sectionHeight flex items-center justify-center flex-col w-half min-w-[200px] px-4 py-8 font-primary">
    <h1 className="text-3xl w-full text-center font-bold mb-6 text-primary">Sitemap</h1>
    <div className=" w-full space-y-2">
      {sitemap.map((route, index) => (
        <div key={route.title}>
          <div
            className={`flex justify-between w-full items-center p-4 bg-gray-100 rounded cursor-pointer ${
              route.children ? "hover:bg-gray-200" : "cursor-default"
            }`}
            onClick={() => route.children && toggleAccordion(index)}
          >
            <Link
              to={`${route.path}${route.children?route.children[0].path:""}`}
              className="text-lg w-full font-semibold text-primary hover:underline"
            >
              {route.title}
            </Link>
            {route.children && (
              <span className="min-w-[20px] text-xl text-center aspect-square w-2 rounded-full hover:bg-blue-300">{openIndex === index ? "−" : "+"}</span>
            )}
          </div>
          {openIndex === index && route.children && (
            <ul className="pl-5 mb-2 bg-gray-100 rounded w-full">
              {route.children.map((child) => (
                <li key={child.path} className="p-2">
                  <Link
                    to={`${route.path}${child.path}`}
                    className="text-primary hover:underline"
                  >
                    {child.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </div>
  );
};

export default Sitemap;
