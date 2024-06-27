import { Glob } from "bun";
import { stat } from "fs/promises";
import { join } from 'path';
import { parseArgs } from "util";
import { rewriter } from "./rewriter";

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


const path = join(args.path);
if ((await stat(path)).isFile()) {
    const text = await Bun.file(path).text();
    const result = rewriter.transform(text);
    await Bun.write(join('./export', path), result);
} else {
    const glob = new Glob("**/*.html")
    for await (const file of glob.scan(path)) {
        // console.log(file);
        const text = await Bun.file(join(path, file)).text();
        const result = rewriter.transform(text);
        await Bun.write(join('./export', file), result);
    }
}
