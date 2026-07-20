// ============================================================
// SSC REGISTRY INDEX
// ============================================================

import { CGL_PROFILES } from "./cgl";
import { CHSL_PROFILES } from "./chsl";

export const sscRegistry = [...CGL_PROFILES, ...CHSL_PROFILES];

export { CGL_PROFILES, CHSL_PROFILES };
export { SSC_CGL_DEST_EN, SSC_CGL_DEST_HI, SSC_CGL_CPT_STUB } from "./cgl";
export { SSC_CHSL_LDC_JSA_EN, SSC_CHSL_LDC_JSA_HI, SSC_CHSL_DEO } from "./chsl";
