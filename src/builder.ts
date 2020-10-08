import { compileShader, gl, linkProgram } from './context.js';

export class Builder {
  private program = gl.createProgram();
  private disposers = [];

  compile(type: number, src: string) {
    const shader = compileShader(type, src);
    gl.attachShader(this.program, shader);

    const cleanup = () => {
      gl.detachShader(this.program, shader);
      gl.deleteShader(shader);
    };
    this.disposers.push(cleanup);
  }

  link() {
    linkProgram(this.program);

    return this.program;
  }

  dispose() {
    this.disposers.forEach((x) => x());
  }
}
