import { TargetType } from "@/lib/base/enums";

const relationTypes = {
  [TargetType.Company]: [
    TargetType.Office,
    TargetType.Working,
    TargetType.Research,
    TargetType.Laboratory,
    TargetType.Department,
  ],
  [TargetType.Hospital]: [
    TargetType.Section,
    TargetType.Office,
    TargetType.Working,
    TargetType.Research,
    TargetType.Laboratory,
    TargetType.Department,
  ],
  [TargetType.University]: [
    TargetType.College,
    TargetType.Office,
    TargetType.Working,
    TargetType.Research,
    TargetType.Laboratory,
    TargetType.Department,
  ],
  [TargetType.Group]: [
    TargetType.Company,
    TargetType.Hospital,
    TargetType.University,
  ],
  [TargetType.College]: [
    TargetType.Major,
    TargetType.Office,
    TargetType.Working,
    TargetType.Research,
    TargetType.Laboratory,
  ],
  [TargetType.Section]: [
    TargetType.Office,
    TargetType.Working,
    TargetType.Research,
    TargetType.Laboratory,
  ],
  [TargetType.Department]: [
    TargetType.Office,
    TargetType.Working,
    TargetType.Research,
    TargetType.Laboratory,
  ],
  [TargetType.Major]: [TargetType.Working],
  [TargetType.Research]: [TargetType.Working],
  [TargetType.Laboratory]: [TargetType.Working],
  [TargetType.Cohort]: [TargetType.Person],
  [TargetType.Person]: [TargetType.Person],
  [TargetType.Office]: [TargetType.Person],
  [TargetType.Working]: [TargetType.Person],
  [TargetType.Station]: [TargetType.Person],
};

function getRelationTypes(targetType: TargetType) {
  return relationTypes[targetType];
}

export default getRelationTypes;
