import { useInstall } from "@/common/utils";
import index from "./src/index.vue";

export { type Step } from "./src/index.vue";

export const ProSteps = useInstall(index);

export default index;
