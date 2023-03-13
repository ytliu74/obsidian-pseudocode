declare module 'pseudocode' {
    export class ParseError extends Error { }
    export function render(input: string, baseDomEle?: Element, options?: any): Element;
    export function renderToString(input: string, options?: any): string;
    export function renderElement(elem: Element, options?: any): void;
}