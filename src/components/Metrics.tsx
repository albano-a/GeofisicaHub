import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";

type SortOpt = "name-asc" | "name-desc" | "date-asc" | "date-desc";

function Metrics({
  label,
  value,
  onSearchChange,
  searchPlaceholder,
  onSortChange,
  onFilterClick,
  showSort = false,
  showFilter = false,
}: {
  label: string;
  value: string | number;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  onSortChange?: (sort: SortOpt) => void;
  onFilterClick?: () => void;
  showSort?: boolean;
  showFilter?: boolean;
}) {
  const { t } = useTranslation();
  const [srchVal, setSrchVal] = useState("");
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [currSort, setCurrSort] = useState<SortOpt>("name-asc");

  const handleSrch = (val: string) => {
    setSrchVal(val);
    onSearchChange(val);
  };

  const handleClr = () => {
    setSrchVal("");
    onSearchChange("");
  };

  const handleSortClick = (e: React.MouseEvent<HTMLElement>) => {
    setSortAnchor(e.currentTarget);
  };

  const handleSortSelect = (sort: SortOpt) => {
    setCurrSort(sort);
    onSortChange?.(sort);
    setSortAnchor(null);
  };

  const placeholder = searchPlaceholder || t("HUB.Search");

  const sortOpts: { val: SortOpt; lbl: string }[] = [
    { val: "name-asc", lbl: "Name (A-Z)" },
    { val: "name-desc", lbl: "Name (Z-A)" },
    { val: "date-asc", lbl: "Date (Oldest)" },
    { val: "date-desc", lbl: "Date (Newest)" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto mb-8 px-4">
      <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 shrink-0">
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium mb-1">
                {label}
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 w-full md:w-auto max-w-2xl">
            <div className="flex-1 relative">
              <TextField
                variant="outlined"
                type="text"
                placeholder={placeholder}
                value={srchVal}
                onChange={(e) => handleSrch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchTwoToneIcon className="text-gray-400 dark:text-gray-500" />
                      </InputAdornment>
                    ),
                    endAdornment: srchVal && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClr}
                          edge="end"
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ClearIcon
                            fontSize="small"
                            className="text-gray-400"
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "10px 14px",
                    fontSize: "0.95rem",
                  },
                }}
                className="bg-white dark:bg-gray-700/50 backdrop-blur-sm"
              />
            </div>

            {showSort && (
              <>
                <IconButton
                  onClick={handleSortClick}
                  className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm border border-gray-200 dark:border-gray-600"
                  sx={{ borderRadius: "10px", padding: "10px" }}
                >
                  <SortIcon className="text-gray-600 dark:text-gray-300" />
                </IconButton>
                <Menu
                  anchorEl={sortAnchor}
                  open={Boolean(sortAnchor)}
                  onClose={() => setSortAnchor(null)}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        borderRadius: "12px",
                      },
                    },
                  }}
                >
                  {sortOpts.map((opt) => (
                    <MenuItem
                      key={opt.val}
                      onClick={() => handleSortSelect(opt.val)}
                      selected={currSort === opt.val}
                      sx={{
                        minWidth: 180,
                        py: 1.5,
                        "&.Mui-selected": {
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                        },
                      }}
                    >
                      {opt.lbl}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            {showFilter && (
              <IconButton
                onClick={onFilterClick}
                className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm border border-gray-200 dark:border-gray-600"
                sx={{ borderRadius: "10px", padding: "10px" }}
              >
                <FilterListIcon className="text-gray-600 dark:text-gray-300" />
              </IconButton>
            )}
          </div>
        </div>

        {srchVal && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Searching for:</span>
            <span className="font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
              "{srchVal}"
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Metrics;
