import type { Element } from "./types";


export const insertToDo = (element: Element) => {
    element.before("<!-- TODO: Check this migration script as it is tricky to convert all conditional operations in templates --> \n", { html: true });
}
export const hasOneOfAttributes = (element: Element, attributes: string[]) => attributes.some(attribute => element.hasAttribute(attribute));
export const addClass = (element: Element, className: string) => {
    const classes = element.getAttribute('class') ?? '';
    const asSet = new Set(classes.split(' '))
    const all = asSet.union(new Set(className.split(' ')))
    element.setAttribute('class', [...all].join(' '));
}
export const wrapAttributeAsVariable = (attribute: string, isVar?: boolean) => {
    return isVar ? `[${attribute}]` : attribute;
}