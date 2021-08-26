export interface RobotStage {
  count: number;
  stage: string;
  stageName: string;
}

export interface RobotStageLimits {
  stage: string;
  stageName: string;
  optimalCount: number;
  criticalPercent: number;
}

export interface RobotStagesResponse {
  data: RobotStage[];
  settings: RobotStageLimits[];
}
