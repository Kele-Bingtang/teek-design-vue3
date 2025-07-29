import type { Ref, ShallowRef, ComputedRef, WatchStopHandle } from "vue";
import { onScopeDispose } from "vue";
import { useEventListener } from "@vueuse/core";

/**
 * 监听按键按下
 */
interface UseKeyDownOptions {
  /**
   * 监听变量
   */
  watcher?: Ref<boolean> | ShallowRef<boolean> | ComputedRef<boolean>;
  /**
   * 按键触发的回调
   */
  callback: (event: KeyboardEvent) => void;
}

export const useKeyDown = (options: UseKeyDownOptions) => {
  const { watcher, callback } = options;
  let clean = () => {};
  let stopWatch: WatchStopHandle | null = null;

  const start = () => {
    const watcherValue = unref(watcher);
    if (watcherValue) {
      clean();
      clean = useEventListener("keydown", callback);
    }

    if (watcherValue !== undefined) {
      stopWatch = watch(
        () => unref(watcher),
        newVal => {
          console.log(2);
          if (newVal) {
            clean();
            clean = useEventListener("keydown", callback);
          } else clean();
        }
      );
    }
  };

  const stop = () => {
    clean();
    stopWatch?.();
  };

  onScopeDispose(() => {
    stop();
  });

  return { start, stop };
};
