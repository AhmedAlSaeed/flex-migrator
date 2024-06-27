import type { Transformer, Element } from './types'
import { addClass, insertToDo, wrapAttributeAsVariable } from './utils';

export const fxFlexMapping = {
    'grow': 'flex: 1 1 100%',
    'initial': 'flex: 0 1 auto',
    'auto': 'flex: <grow> <shrink> 100%',
    'none': 'flex: 0 0 auto',
    'nogrow': 'flex: 0 1 auto',
    'noshrink': 'flex: 1 0 auto'
}
export const fxLayoutAlignMainMapping = {
    '': 'justify-start',
    'none': 'justify-start',
    'flex-start': 'justify-start',
    'start': 'justify-start',
    'center': 'justify-center',
    'flex-end': 'justify-start',
    'end': 'justify-end',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly',
}
export const fxLayoutAlignCrossMapping = {
    '': 'items-stretch content-stretch',
    'none': 'items-stretch content-stretch',
    'center': 'items-center content-center',
    'start': 'items-start content-start',
    'flex-start': 'items-start content-start',
    'end': 'items-end content-end',
    'flex-end': 'items-end content-end',
    'space-between': 'items-between content-between',
    'space-around': 'items-around justify-around',
    'baseline': 'items-end content-stretch'
}
const screenSizes = [
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    'lt-sm',
    'lt-md',
    'lt-lg',
    'lt-xl',
    'gt-xs',
    'gt-sm',
    'gt-md',
    'gt-lg',
]

export type MainAlignment = keyof typeof fxLayoutAlignMainMapping;
export type CrossAlignment = keyof typeof fxLayoutAlignCrossMapping;


const handleFlexAlignment = (element: Element, value: string) => {
    let [justify, align] = value.split(' ');
    align = (align == '' || align == undefined) ? 'start' : align.replace('space-', '').replace('flex-', '');
    justify = (justify == '') ? 'start' : justify.replace('space-', '').replace('flex-', '');
    if (justify == 'strech') {
        return `items-${align} ${justify}`;
    }
    return `items-${align} justify-${justify}`;
}
export const appendSizeToClass = (className: string, size?: string) => {
    return size && size != '' ? `${size}:${className}` : className
}
export const transformers: Record<string, Transformer> = {
    fxLayout: (element, ctx) => {
        const { value, isBinding, size, attribute } = ctx;
        if (isBinding) {
            insertToDo(element)
            /* 
            TODO: Handle variable bindings 
            [fxLayout]="layout" [class]= "{flex-row: layout == 'row', flex-col: layout == 'column'}" 
            [class.flex-row]="layout == 'row'" [class.flex-col]="layout == 'column'"
            */
            return
        }
        let className = `flex-${value == 'row' ? 'row' : 'col'}`;
        addClass(element, appendSizeToClass(className, size));
        element.removeAttribute(attribute);
    },
    fxLayoutGap: (element, ctx) => {
        let { attribute, value, isBinding, size } = ctx;
        if (isBinding) {
            insertToDo(element)
            return
        }
        if (value.endsWith('grid')) {
            const [first, _] = value.split(' ');
            value = first;
        }
        const isDirect = value.endsWith('px') || value.endsWith('em') || value.endsWith('rem') || value.endsWith('vw') || value.endsWith('vh') || value.endsWith('%');
        const className = isDirect ? `gap-[${value}]` : `gap-${(+value) / 4}`;
        addClass(element, appendSizeToClass(className, size));
        element.removeAttribute(attribute);
    },
    fxLayoutAlign: (element, isVar) => {
        if (isVar) {
            insertToDo(element)
            return
        }
        const value = element.getAttribute('fxLayoutAlign');
        if (!value) return;
        const [main, cross] = value.split(' ');
        addClass(element, fxLayoutAlignMainMapping[main as MainAlignment] ?? '');
        addClass(element, fxLayoutAlignCrossMapping[cross as CrossAlignment] ?? '');
        element.removeAttribute('fxLayoutAlign');

    },
    fxFlexFill: (element, isVar) => {
        if (isVar) {
            insertToDo(element)
            return
        }
        addClass(element, 'flex-1');
        element.removeAttribute('fxFlexFill');
    },
    fxFill: (element, isVar) => {
        if (isVar) {
            insertToDo(element)
            return
        }
        addClass(element, 'w-full h-full');
        element.removeAttribute('fxFill');
    }
}

export const extractAttributes = (element: Element) => {
    let dirs: Record<string, string> = {}
    for (const [attr, value] of element.attributes) {
        dirs[attr] = value;
    }
    return dirs;
}
export const checkAndApply = (element: Element, directive: string, size: string, attrs: Record<string, string>, transformer: Transformer) => {
    // console.log(attrs);
    let isProcessed = false;
    const dir = directive.toLowerCase();
    if (attrs[dir]) {
        transformer(element, { value: attrs[dir], isBinding: false, size, attribute: dir });
        isProcessed = true;
    }
    const asVer = `[${dir}]`
    if (attrs[asVer]) {
        transformer(element, { value: attrs[asVer], isBinding: true, size, attribute: dir });
        isProcessed = true;
    }

    return isProcessed;
}

export const processDirectives = (element: Element) => {
    const attrs = extractAttributes(element);
    let hasAtLeastOneFxDirective = false;
    for (const [directive, transform] of Object.entries(transformers)) {
        const defaultDirective = checkAndApply(element, directive, '', attrs, transform);
        if (defaultDirective) {
            hasAtLeastOneFxDirective = true;
        }
        for (const size of screenSizes) {
            let SizedDirective = checkAndApply(element, `${directive}.${size}`, size, attrs, transform);
            if (SizedDirective) {
                hasAtLeastOneFxDirective = true;
            }
        }
    }
    return hasAtLeastOneFxDirective;
} 
