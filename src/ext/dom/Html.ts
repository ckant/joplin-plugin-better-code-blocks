import { def } from "@ext/stdlib/existence"

/**
 * Extensions for Html elements.
 */
export namespace Html {
  /**
   * Creates a button with the given {@link className}, {@link title}, and {@link onClick}.
   * Appends the {@link children}.
   */
  export function button(props: {
    className: string
    title: string
    onClick: (this: HTMLElement, e: MouseEvent) => void
    children: readonly HTMLElement[]
  }): HTMLSpanElement {
    return createElement({ tagName: "button", ...props })
  }

  /**
   * Creates a span with the given {@link className} and {@link textContent}.
   * Appends the {@link children}, if given.
   */
  export function span(props: {
    className: string
    textContent?: string
    children?: readonly HTMLElement[]
  }): HTMLSpanElement {
    return createElement({ tagName: "span", ...props })
  }

  /**
   * Creates an `i` with the given {@link className}.
   */
  export function i({ className }: { className: string }): HTMLElement {
    const element = document.createElement("i")
    element.className = className
    return element
  }

  /**
   * Adds {@link className} to the given {@link HTMLElement} (if it doesn't already exist).
   */
  export function addClass({ classList }: HTMLElement, className: string): void {
    classList.add(className)
  }

  /**
   * Removes {@link className} from the given {@link HTMLElement} (if it exists).
   */
  export function removeClass({ classList }: HTMLElement, className: string): void {
    classList.remove(className)
  }

  /**
   * Swaps {@link from} with {@link to} if {@link from} exists on the {@link HTMLElement}.
   */
  export function swapClass(
    { classList }: HTMLElement,
    { from, to }: { from: string; to: string },
  ): void {
    if (classList.contains(from)) {
      classList.remove(from)
      classList.add(to)
    }
  }

  /**
   * Adds the given {@link onClick} event listener to {@link element}.
   */
  export function addOnClick(
    element: HTMLElement,
    onClick: (this: HTMLElement, e: MouseEvent) => void,
  ): void {
    element.addEventListener<"click">("click", onClick)
  }

  /**
   * Removes the given {@link onClick} event listener from {@link element} (if it exists).
   */
  export function removeOnClick(
    element: HTMLElement,
    onClick: (this: HTMLElement, e: MouseEvent) => void,
  ): void {
    element.removeEventListener<"click">("click", onClick)
  }

  const createElement = <K extends keyof HTMLElementTagNameMap>({
    tagName,
    className,
    title,
    textContent,
    onClick,
    children,
  }: {
    tagName: K
    className: string
    title?: string
    textContent?: string
    onClick?: (this: HTMLElement, e: MouseEvent) => void
    children?: readonly HTMLElement[]
  }): HTMLElementTagNameMap[K] => {
    const element = document.createElement(tagName)
    element.className = className
    if (def(title)) element.title = title
    if (def(textContent)) element.textContent = textContent
    if (def(onClick)) addOnClick(element, onClick)
    if (def(children)) children.forEach((it) => element.appendChild(it))

    return element
  }
}
