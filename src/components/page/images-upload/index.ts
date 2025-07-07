import { useInstall } from "@/common/utils";
import index from "./src/image.vue";

export const ImageUpload = useInstall(index);

export type * from "./src/types";

export default index;
