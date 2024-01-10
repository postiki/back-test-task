export const bufferToArray = (buffer: Buffer) => {
    return Array.from(new Uint8Array(buffer));
};