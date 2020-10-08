const glCanvas = document.getElementById('glcanvas') as HTMLCanvasElement;
export const gl = glCanvas.getContext('webgl2');
if (!gl) {
  throw new Error('Could not create webgl context.');
}

export function compileShader(type: number, src: string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    throw new Error(`Error compiling shader: ${log}`);
  }

  return shader;
}

export function linkProgram(program: WebGLProgram) {
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    throw new Error(`Error linking shader program: ${log}`);
  }
}
