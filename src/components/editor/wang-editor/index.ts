import { useInstall } from "@/common/utils";
import index, { type FileInsertFnType, type ImageInsertFnType, type VideoInsertFnType } from "./src/index.vue";

export { type FileInsertFnType, type ImageInsertFnType, type VideoInsertFnType };

export const WangEditor = useInstall(index);

export default index;
