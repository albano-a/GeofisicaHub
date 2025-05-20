import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import PercentIcon from "@mui/icons-material/Percent";

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
    <Card
      variant="outlined"
      className="bg-white dark:bg-geo-primary/20 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <CardActionArea
        component="a"
        href={link}
        className="rounded-lg flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-105"
      >
        <CardHeader
          title={
            <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white animate-fade-in">
              {subject}
            </h2>
          }
          className="w-full flex justify-center"
        />
        <CardContent className="flex flex-col items-center justify-center">
          <p className="text-base text-gray-700 dark:text-gray-200 animate-fade-in">
            {description}
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
