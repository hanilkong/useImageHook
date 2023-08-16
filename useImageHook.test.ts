import { renderHook, screen } from "@testing-library/react";
import React from "react";
import useImageHook from ".";

test("image button test", () => {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const {
    result: {
      current: {},
    },
  } = renderHook(() => useImageHook(ref));
  const button = screen.getByRole("button", {});
  console.log("🚀 ~ file: useImageHook.test.ts:13 ~ test ~ button:", button);
});
