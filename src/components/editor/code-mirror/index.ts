import { useInstall } from "@/common/utils";
import index, { type MergeCodeMirrorProps, type CodeMirrorProps } from "./src/index.vue";

export { type MergeCodeMirrorProps, type CodeMirrorProps };

export const CodeMirror = useInstall(index);

export default index;
