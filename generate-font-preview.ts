import { optimize } from 'svgo';
import TextToSVG from 'text-to-svg';

const textToSVG = TextToSVG.loadSync(process.argv[2]);
const svg = textToSVG.getSVG('测试文本 ABC123', {
    fontSize: 16,
    anchor: 'left top',
});
const optimized = optimize(svg, {
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    cleanupNumericValues: {
                        floatPrecision: 2,
                    },
                    convertPathData: {
                        floatPrecision: 2,
                        transformPrecision: 2,
                    },
                    convertShapeToPath: {
                        floatPrecision: 2,
                    },
                    convertTransform: {
                        floatPrecision: 2,
                        transformPrecision: 2,
                    },
                    mergePaths: {
                        floatPrecision: 2,
                    },
                },
            },
        },
        {
            name: 'cleanupListOfValues',
            params: {
                floatPrecision: 2,
            },
        },
    ],
}).data;
const match =
    // biome-ignore lint/style/noNonNullAssertion: reason
    /^<svg .+? width="((?:\d*\.)?\d+)" height="((?:\d*\.)?\d+)"><path d="(.+?)"\/><\/svg>$/g.exec(optimized)!;
console.log(
    JSON.stringify({
        width: parseFloat(match[1]),
        height: parseFloat(match[2]),
        path: match[3],
    }),
);
