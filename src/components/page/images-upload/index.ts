import { useInstall } from "@/common/utils";
import image from "./src/image.vue";
import images from "./src/images.vue";

export const ImageUpload = useInstall(image);
export const ImagesUpload = useInstall(images);

export default [image, images];
