import { useInstall } from "@/common/utils";
import role from "./src/role.vue";
import auth from "./src/auth.vue";

export const Role = useInstall(role);
export const Auth = useInstall(auth);

export default [auth, role];
