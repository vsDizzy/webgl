export class Builder {
  private program = this.gl.createProgram();
  private disposers = [];

  constructor(private gl: WebGL2RenderingContext) {}

  compile(type: number, src: string) {
    const shader = createShader(this.gl, type, src);
    this.gl.attachShader(this.program, shader);

    const cleanup = () => {
      this.gl.detachShader(this.program, shader);
      this.gl.deleteShader(shader);
    };
    this.disposers.push(cleanup);
  }

  link() {
    linkProgram(this.gl, this.program);
    this.dispose();

    return this.program;
  }

  private dispose() {
    this.disposers.forEach((x) => x());
  }
}

function createShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    throw new Error(`Error compiling shader: ${log}`);
  }

  return shader;
}

function linkProgram(gl: WebGL2RenderingContext, program: WebGLProgram) {
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    throw new Error(`Error linking shader program: ${log}`);
  }
}
