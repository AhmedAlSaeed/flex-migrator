export type Element = HTMLRewriterTypes.Element;
export type DirectiveOptions = {
    value: string,
    size?: string,
    isBinding?: boolean,
    attribute: string
}
export type Transformer = (element: Element, options: DirectiveOptions) => void
export type Check = (element: Element) => boolean