import React from "react";
import { useTranslation } from "react-i18next";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import HubTwoToneIcon from "@mui/icons-material/HubTwoTone";
import BuildTwoToneIcon from "@mui/icons-material/BuildTwoTone";
import FeedTwoToneIcon from "@mui/icons-material/FeedTwoTone";
import Brightness4TwoToneIcon from "@mui/icons-material/Brightness4TwoTone";
import Brightness7TwoToneIcon from "@mui/icons-material/Brightness7TwoTone";
import LanguageSelector from "./LanguageSelector";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const iconSx = { color: "#1077bc" };

const getNavItems = (): NavItem[] => [
  { label: "Home", path: "/", icon: <HomeTwoToneIcon sx={iconSx} /> },
  { label: "About", path: "/about", icon: <InfoTwoToneIcon sx={iconSx} /> },
  { label: "Hub", path: "/hub", icon: <HubTwoToneIcon sx={iconSx} /> },
  {
    label: "Posts",
    path: "/posts",
    icon: <FeedTwoToneIcon sx={iconSx} />,
  },
  { label: "Tools", path: "/tools", icon: <BuildTwoToneIcon sx={iconSx} /> },
];

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const navItems = getNavItems();

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = (
    <div className="w-64" role="presentation" onClick={handleDrawerToggle}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              {item.icon}
              <ListItemText
                primary={t(`Navbar.${item.label}`)}
                className="ml-2"
                primaryTypographyProps={{ sx: { color: "#1077bc" } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <div className="flex justify-center py-2">
        <LanguageSelector />
      </div>
    </div>
  );

  return (
    <>
      <div className=" bg-geo-lightbg dark:bg-geo-darkbg shadow-none">
        <Toolbar className="w-full max-w-7xl mx-auto flex justify-between items-center px-4">
          <Link to="/" className="flex items-center">
            <img
              src="/logotipo_final.svg"
              alt="Brand Logo"
              className="h-10 w-auto"
            />
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4 text-geo-primary dark:text-geo-darkprimary">
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                className="hover:text-geo-accent capitalize"
                sx={{ color: "inherit" }}
              >
                {t(`Navbar.${item.label}`)}
              </Button>
            ))}
            <IconButton
              sx={{ ml: 0 }}
              onClick={() => setDarkMode((prev) => !prev)}
              color="inherit"
            >
              {darkMode ? (
                <Brightness7TwoToneIcon />
              ) : (
                <Brightness4TwoToneIcon />
              )}
            </IconButton>
            <LanguageSelector />
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center text-geo-primary dark:text-geo-darkprimary">
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => setDarkMode((prev) => !prev)}
              color="inherit"
            >
              {darkMode ? (
                <Brightness7TwoToneIcon />
              ) : (
                <Brightness4TwoToneIcon />
              )}
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              size="large"
            >
              <MenuIcon className="text-gray-700" />
            </IconButton>
          </div>
        </Toolbar>
      </div>
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        className="md:hidden"
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
