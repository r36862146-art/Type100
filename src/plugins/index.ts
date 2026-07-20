import { pluginManager } from "@/core/plugins/PluginManager";
import { SSCPlugin } from "./ssc";
import { RRBPlugin } from "./rrb";
import { AndamanPlugin } from "./andaman";

// Auto-register all official plugins
pluginManager.register(SSCPlugin);
pluginManager.register(RRBPlugin);
pluginManager.register(AndamanPlugin);

export { pluginManager };
