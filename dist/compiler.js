import { gl } from './context.js';
export async function compileProgram(vertexShaderUrl, fragmentShaderUrl) {
    const program = gl.createProgram();
    const vs = gl.createShader(gl.VERTEX_SHADER);
    compileShader(vs, await readFile(vertexShaderUrl));
    gl.attachShader(program, vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    compileShader(fs, await readFile(fragmentShaderUrl));
    gl.attachShader(program, fs);
    linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return program;
}
async function readFile(url) {
    const res = await fetch(url);
    return await res.text();
}
function compileShader(shader, src) {
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        throw new Error(`Error compiling shader: ${log}`);
    }
}
function linkProgram(program) {
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program);
        throw new Error(`Error linking shader program: ${log}`);
    }
}
