import React, { useState, useRef } from "react";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { US, BR, FR, ES, IT, DE } from "country-flag-icons/react/3x2";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English", Flag: US },
  { code: "pt", label: "Português", Flag: BR },
  { code: "fr", label: "Français", Flag: FR },
  { code: "es", label: "Español", Flag: ES },
  { code: "it", label: "Italiano", Flag: IT },
  { code: "de", label: "Deutsch", Flag: DE },
];

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const lang = i18next.resolvedLanguage || i18next.language;
  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const CurrentFlag = currentLang.Flag;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleChange = (code: string) => {
    i18next.changeLanguage(code);
    handleClose();
  };

  return (
    <>
      <Tooltip title={t("language")}>
        <IconButton
          ref={buttonRef}
          size="small"
          onClick={handleOpen}
          sx={{ p: 0.5 }}
        >
          <CurrentFlag style={{ width: 24, height: 18, borderRadius: 2 }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { style: { minWidth: 80 } }
        }}
      >
        {LANGUAGES.map(({ code, label, Flag }) => (
          <MenuItem
            key={code}
            selected={lang === code}
            onClick={() => handleChange(code)}
            sx={{ minHeight: 28, fontSize: 13, gap: 1 }}
          >
            <Flag style={{ width: 20, height: 15, borderRadius: 2 }} />
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
