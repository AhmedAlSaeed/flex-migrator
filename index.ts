import { parseArgs } from "util";
import { processDirectives } from "./mappings";
import { addClass } from "./utils";
const { values: args } = parseArgs({
    args: Bun.argv,
    options: {
        'path': { type: 'string', alias: 'p' },
        'inplace': {
            type: 'boolean', alias: 'i', short: 'i',
        }
    },
    strict: true,
    allowPositionals: true,
});
if (args.path == undefined) {
    console.error('Path is required');
    process.exit(1);
}
console.log(args)
const rewriter = new HTMLRewriter();

rewriter.on('*', {
    element(element) {
        const hasAtLeastOneFxDirective = processDirectives(element);
        if (hasAtLeastOneFxDirective) {
            addClass(element, 'flex');
        }
    },
})

const ts = rewriter.transform(
    `
    <div fxLayout="row" fxLayout.xl="column" fxLayoutGap="16" class="test">
        <div fxFlex="50" fxFlex.xl="100" fxFlexFill fxFill></div>
        <div fxFlex="50" fxFlex.xl="100"></div>
    </div>
    `
)
console.log(ts)
// const path = join(args.path);
// if ((await stat(path)).isFile()) {
//     const text = await Bun.file(path).text();
//     const result = rewriter.transform(text);
//     await Bun.write(join('./export', path), result);
// } else {
//     const glob = new Glob("**/*.html")
//     for await (const file of glob.scan(path)) {
//         // console.log(file);
//         const text = await Bun.file(join(path, file)).text();
//         const result = rewriter.transform(text);
//         await Bun.write(join('./export', file), result);
//     }
// }
