import {
  LayoutDashboard,
  FileCode2,
  Presentation,
  FileText,
} from "lucide-react";

export const dashboardTabs = [
  {
    key: "overview",
    label: "Overview",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    key: "technical-document",
    label: "Technical Docs",
    path: "/technical-docs",
    icon: FileCode2,
  },
  {
    key: "ppt",
    label: "PPT Agent",
    path: "/ppt",
    icon: Presentation,
  },
  {
    key: "brd",
    label: "BRD Agent",
    path: "/brd",
    icon: FileText,
  },
];

export function getDashboardTabByKey(key) {
  return dashboardTabs.find((tab) => tab.key === key) ?? dashboardTabs[0];
}
