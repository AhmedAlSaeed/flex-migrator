import { processDirectives } from "./mappings";
import { addClass } from "./utils";

const rewriter = new HTMLRewriter();

rewriter.on('*', {
    element(element) {
        const hasAtLeastOneFxDirective = processDirectives(element);
        if (hasAtLeastOneFxDirective) {
            addClass(element, 'flex');
        }
    },
})


export { rewriter }