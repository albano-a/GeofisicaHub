import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBreadcrumbSchema } from "../hooks/useSEO";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  customItems?: BreadcrumbItem[];
  postTitle?: string;
}

export default function Breadcrumb({
  customItems,
  postTitle,
}: BreadcrumbProps) {
  const { t } = useTranslation();
  const location = useLocation();

  // Auto-generate breadcrumbs based on current path if no custom items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t("Navbar.home", "Home"), href: "/" },
    ];

    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      let label = segment;

      // Translate common segments
      switch (segment) {
        case "posts":
          label = t("Navbar.Posts", "Posts");
          break;
        case "hub":
          label = t("Navbar.Hub", "Learning Hub");
          break;
        case "tools":
          label = t("Navbar.Tools", "Tools");
          break;
        case "about":
          label = t("Navbar.About", "About");
          break;
        case "geophysics":
          label = t("HUB.Geophysics", "Geophysics");
          break;
        case "geology":
          label = t("HUB.Geology", "Geology");
          break;
        case "physics":
          label = t("HUB.Physics", "Physics");
          break;
        case "calculus":
          label = t("HUB.Calculus", "Calculus");
          break;
        case "programming":
          label = t("HUB.Programming", "Programming");
          break;
        default:
          // For post slugs, use postTitle if provided, otherwise format the slug
          if (isLast && postTitle) {
            label = postTitle;
          } else {
            label = segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
          }
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // Generate schema data for SEO
  const schemaItems = breadcrumbItems.map((item) => ({
    name: item.label,
    url: item.href || location.pathname,
  }));

  useBreadcrumbSchema(schemaItems);

  // Don't show breadcrumbs on home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                /
              </span>
            )}

            {item.current ? (
              <span
                className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-[200px] sm:max-w-none"
                aria-current="page"
                title={item.label}
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                to={item.href}
                className="hover:text-geo-primary dark:hover:text-geo-darkprimary transition-colors flex items-center"
              >
                {index === 0 && (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                )}
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500 dark:text-gray-500">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
