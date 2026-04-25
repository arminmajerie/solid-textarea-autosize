import { onCleanup } from "solid-js";

export const useWindowResizeListener = (listener: (event?: UIEvent) => void) => {
  const handler = (event: UIEvent) => listener(event);

  window.addEventListener("resize", handler);
  onCleanup(() => window.removeEventListener("resize", handler));
};
