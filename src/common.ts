export const src2image = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

// biome-ignore lint/suspicious/noExplicitAny: reason
// 只能同时有一个async function在运行
// 如果在运行的时候又要运行一次，则后者立即返回，前者运行结束后再运行一次
// 主要用于画图，加载字体等可能需要较长时间，避免重复运行
export const asyncAtATime = <T extends (...args: any[]) => Promise<void>>(fn: T): T => {
    let running = false;
    let delayed = false;
    // biome-ignore lint/suspicious/noExplicitAny: reason
    const wrapped = async (...args: any[]) => {
        if (running) {
            delayed = true;
            return;
        }
        try {
            running = true;
            await fn(...args);
        } finally {
            running = false;
            if (delayed) {
                setTimeout(wrapped, 0, args);
                delayed = false;
            }
        }
    };
    return wrapped as T;
};
