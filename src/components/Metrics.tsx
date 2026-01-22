import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useTranslation } from "react-i18next";

function Metrics({
  label,
  value,
  onSearchChange,
  searchPlaceholder,
}: {
  label: string;
  value: string | number;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
}) {
  const { t } = useTranslation();
  const [srchVal, setSrchVal] = useState("");

  const handleSrch = (val: string) => {
    setSrchVal(val);
    onSearchChange(val);
  };

  const placeholder = searchPlaceholder || t("HUB.Search"); // Set placeholder inside

  return (
    <div className="w-full max-w-7xl mx-auto mb-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 flex items-center justify-between gap-4">
        <div className="flex items-center shrink-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide mr-2">
            {label}:
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
        <div className="flex-1 max-w-md">
          <TextField
            variant="standard"
            type="text"
            placeholder={placeholder}
            value={srchVal}
            onChange={(e) => handleSrch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon className="text-gray-400" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                padding: "4px 8px",
              },
              "& .MuiInputBase-input": {
                padding: "4px 6px",
              },
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
  );
}

export default Metrics;
