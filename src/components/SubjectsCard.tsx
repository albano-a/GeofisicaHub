// import { useTranslation } from "react-i18next";


type SubjectsCardProps = {
  subject: string;
  description: string;
  link: string;
};

export default function SubjectsCard({
  subject,
  description,
  link,
}: SubjectsCardProps) {
  // const { t } = useTranslation();

  return (
    <>
      <div className="bg-white dark:bg-geo-primary/20 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md hover:shadow-geo-primary transition-shadow">
        <a
          href={link}
          className="rounded-lg flex flex-col items-center justify-center text-center transition-transform duration-300 p-5 hover:scale-105 "
        >
          <span className="hover:text-geo-primary dark:hover:text-geo-darkprimary">
            <div className="w-full flex  justify-center">
              <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white  animate-fade-in">
                {subject}
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-base text-gray-700 dark:text-gray-200 animate-fade-in">
                {description}
              </p>
            </div>
          </span>
        </a>
      </div>
    </>
  );
}
