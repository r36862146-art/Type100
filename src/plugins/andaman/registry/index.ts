// ============================================================
// ANDAMAN REGISTRY INDEX
// ============================================================

import { CHSL_PROFILES } from "./chsl";
import { MTS_PROFILES } from "./matriculation";

export const andamanRegistry = [...CHSL_PROFILES, ...MTS_PROFILES];

export { CHSL_PROFILES, MTS_PROFILES as MATRICULATION_PROFILES };
export { ANDAMAN_CHSL_LDC_EN, ANDAMAN_CHSL_LDC_HI } from "./chsl";
export { ANDAMAN_MTS_EN } from "./matriculation";
