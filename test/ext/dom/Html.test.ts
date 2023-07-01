import { describe, expect, it } from "vitest"

import { Html } from "@ext/dom/Html"
import { def } from "@ext/stdlib/existence"

describe("Html", () => {
  describe("button", () => {
    it("creates a button with all props", () => {
      let clicked = false
      const onClick = () => void (clicked = true)
      const child = anElement()

      const button = Html.button({
        className: "className",
        title: "title",
        onClick: onClick,
        children: [child],
      })
      button.click()

      expect(button.className).toBe("className")
      expect(button.title).toBe("title")
      expect(clicked).toBe(true)
      expect(button.childElementCount).toBe(1)
      expect(button.firstElementChild).toBe(child)
    })
  })

  describe("span", () => {
    it("creates a span with all props", () => {
      const child = anElement()

      const span = Html.span({
        className: "className",
        textContent: "textContent",
        children: [child],
      })
      span.click()

      expect(span.className).toBe("className")
      expect(span.textContent).toBe("textContent")
      expect(span.childElementCount).toBe(1)
      expect(span.firstElementChild).toBe(child)
    })

    it("creates a span with required props", () => {
      const span = Html.span({ className: "className" })

      expect(span.className).toBe("className")
      expect(span.textContent).toBe("")
      expect(span.childElementCount).toBe(0)
    })
  })

  describe("i", () => {
    it("creates an i", () => {
      const i = Html.i({
        className: "className",
      })

      expect(i.className).toBe("className")
    })
  })

  describe("addClass", () => {
    it("adds class", () => {
      const element = anElement({ className: "old" })

      Html.addClass(element, "new")

      expect(element.className).toBe("old new")
    })
  })

  describe("removeClass", () => {
    it("removes class", () => {
      const element = anElement({ className: "className" })

      Html.removeClass(element, "className")

      expect(element.className).toBe("")
    })
  })

  describe("swapClass", () => {
    it("swaps class when class exists", () => {
      const element = anElement({ className: "old" })

      Html.swapClass(element, { from: "old", to: "new" })

      expect(element.className).toBe("new")
    })

    it("doesn't swap class when class doesn't exist", () => {
      const element = anElement({ className: "old" })

      Html.swapClass(element, { from: "foo", to: "bar" })

      expect(element.className).toBe("old")
    })
  })

  describe("addOnClick", () => {
    it("adds onClick", () => {
      let clicked = false
      const onClick = () => void (clicked = true)
      const element = anElement()

      Html.addOnClick(element, onClick)
      element.click()

      expect(clicked).toBe(true)
    })
  })

  describe("removeOnClick", () => {
    it("removes onClick", () => {
      let clickCount = 0
      const onClick = () => void clickCount++
      const element = anElement({ onClick })

      element.click()
      Html.removeOnClick(element, onClick)
      element.click()

      expect(clickCount).toBe(1)
    })
  })
})

export function anElement(props?: {
  className?: string
  onClick?: (this: HTMLElement, e: MouseEvent) => void
}): HTMLDivElement {
  const div = document.createElement("div")
  if (def(props?.className)) div.className = props!.className
  if (def(props?.onClick)) Html.addOnClick(div, props!.onClick)
  return div
}
