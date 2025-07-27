import { Backdrop } from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  image: string;
  buttonLink: string;
};

export default function CustomBackdrop({
  open,
  onClose,
  title,
  description,
  image,
  buttonLink,
}: Props) {
  const { t } = useTranslation();

  return (
    <Backdrop
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.drawer + 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      })}
      open={open}
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-lg text-center max-w-md shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image}
          alt="Backdrop"
          className="mb-4 rounded-lg w-512 h-256 object-cover"
        />
        <h2 className="mb-2 text-gray-800 text-xl font-semibold">{title}</h2>
        <p className="mb-5 text-gray-600 text-justify ">{description}</p>
        <a
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          {t("Tools.ToolsCard.OpenLink")}
        </a>
      </div>
    </Backdrop>
  );
}
