import { Project, SkillCategory } from "@/data/portfolioData";

export type { Project, SkillCategory };

export interface SkillDomain extends SkillCategory {
  primaryColor: string;
  telemetry?: {
    coresOnline: number;
    clockSpeed: string;
    efficiency: string;
  };
}

export type SceneAct = 1 | 2 | 3 | 4;

export interface ScrollState {
  progress: number;
  currentAct: SceneAct;
  maskDeployment: number; // 0 (open) to 1 (sealed)
  cleaveProgress: number; // 0 to 1
  impactProgress: number; // 0 to 1
}
