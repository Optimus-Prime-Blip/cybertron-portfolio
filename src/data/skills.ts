import { PORTFOLIO_DATA, SkillCategory } from "./portfolioData";
import { SkillDomain } from "@/types";

const DOMAIN_METADATA: {
  primaryColor: string;
  telemetry: { coresOnline: number; clockSpeed: string; efficiency: string };
}[] = [
  {
    primaryColor: "#00ffff",
    telemetry: { coresOnline: 32, clockSpeed: "5.4 GHz", efficiency: "99.4%" },
  },
  {
    primaryColor: "#38bdf8",
    telemetry: { coresOnline: 48, clockSpeed: "6.2 GHz", efficiency: "98.9%" },
  },
  {
    primaryColor: "#a855f7",
    telemetry: { coresOnline: 64, clockSpeed: "7.4 GHz", efficiency: "99.8%" },
  },
  {
    primaryColor: "#f59e0b",
    telemetry: { coresOnline: 24, clockSpeed: "4.8 GHz", efficiency: "97.6%" },
  },
];

export const SKILL_DOMAINS: SkillDomain[] = PORTFOLIO_DATA.skills.map((skillCat, index) => {
  const meta = DOMAIN_METADATA[index] || {
    primaryColor: "#00ffff",
    telemetry: { coresOnline: 32, clockSpeed: "5.0 GHz", efficiency: "99.0%" },
  };

  return {
    ...skillCat,
    primaryColor: meta.primaryColor,
    telemetry: meta.telemetry,
  };
});

export type { SkillCategory };
