import { createEffect, createSignal, on, splitProps } from "solid-js";
import type { ComponentProps, JSX } from "solid-js";
import calculateNodeHeight from "./calculateNodeHeight";
import getSizingData, { SizingData } from "./getSizingData";
import { useWindowResizeListener } from "./hooks";

type TextareaProps = ComponentProps<"textarea">;

type Style = JSX.CSSProperties & {
  height?: never;
  "max-height"?: never;
  "min-height"?: never;
};

type TextareaInputProps = Omit<TextareaProps, "rows">;

export type TextareaHeightChangeMeta = {
  rowHeight: number;
};
export interface TextareaAutosizeProps extends Omit<TextareaProps, "style"> {
  /**
   * Maximum number of rows up to which the textarea can grow
   */
  maxRows?: number;
  /**
   * Minimum number of rows to show for textarea
   */
  minRows?: number;
  /**
   * Setting rows is not allowed.
   * Use maxRows and minRows instead.
   */
  rows?: never;
  /**
   * Function invoked on textarea height change, with height as first argument.
   * The second function argument is an object containing additional information
   * that might be useful for custom behaviors.
   * Current options include { rowHeight: number }.
   */
  onHeightChange?: (height: number, meta: TextareaHeightChangeMeta) => void;
  /**
   * Reuse previously computed measurements when computing height of textarea. Default: false
   */
  cacheMeasurements?: boolean;
  /**
   * Compatibility escape hatch for older call sites that were written like MUI TextField.
   * These props are applied to the underlying textarea instead of being forwarded as DOM attributes.
   */
  inputProps?: TextareaInputProps;
  /**
   * Accepted for compatibility with old call sites. The component renders only the textarea.
   */
  label?: JSX.Element;
  style?: Style;
}

function TextareaAutosize(props: TextareaAutosizeProps) {
  const [local, textareaProps] = splitProps(props, [
    "cacheMeasurements",
    "inputProps",
    "label",
    "maxRows",
    "minRows",
    "onHeightChange",
    "oninput",
    "onInput",
    "ref",
    "style",
  ]);
  const [textarea, setTextarea] = createSignal<HTMLTextAreaElement>();
  let heightRef = 0;
  let measurementsCacheRef: SizingData | undefined = undefined;

  const resizeTextarea = () => {
    const node = textarea();
    if (!node) return;
    const nodeSizingData =
      local.cacheMeasurements && measurementsCacheRef ? measurementsCacheRef : getSizingData(node);

    if (!nodeSizingData) {
      return;
    }

    measurementsCacheRef = nodeSizingData;

    const [height, rowHeight] = calculateNodeHeight(
      nodeSizingData,
      node.value || node.placeholder || "x",
      local.minRows,
      local.maxRows,
    );

    if (heightRef !== height) {
      heightRef = height;
      node.style.setProperty("height", `${height}px`, "important");
      local.onHeightChange?.(height, { rowHeight });
    }
  };

  const handleChange = (
    event: InputEvent & {
      currentTarget: HTMLTextAreaElement;
      target: HTMLTextAreaElement;
    },
  ) => {
    resizeTextarea();
    if (typeof local.inputProps?.oninput === "function") local.inputProps.oninput(event);
    if (typeof local.inputProps?.onInput === "function") local.inputProps.onInput(event);
    if (typeof local.oninput === "function") local.oninput(event);
    if (typeof local.onInput === "function") local.onInput(event);
  };

  const setRefs = (element: HTMLTextAreaElement) => {
    setTextarea(element);
    if (typeof local.inputProps?.ref === "function") local.inputProps.ref(element);
    if (typeof local.ref === "function") local.ref(element);
  };

  const mergedStyle = () => {
    const inputStyle = local.inputProps?.style;

    if (!inputStyle) return local.style;
    if (!local.style) return inputStyle;
    if (typeof inputStyle === "string") return local.style;

    return { ...inputStyle, ...local.style };
  };

  createEffect(
    on(
      () => [
        props.value,
        props.placeholder,
        local.inputProps?.value,
        local.inputProps?.placeholder,
      ],
      resizeTextarea,
    ),
  );

  createEffect(() => {
    if (typeof document !== "undefined" && textarea()) {
      resizeTextarea();
      useWindowResizeListener(resizeTextarea);
    }
  });

  return (
    <textarea
      {...local.inputProps}
      {...textareaProps}
      style={mergedStyle()}
      oninput={handleChange}
      onInput={handleChange}
      ref={setRefs}
    />
  );
}

export default TextareaAutosize;
