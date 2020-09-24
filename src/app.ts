import { mat4 } from 'gl-matrix';

const glCanvas = document.getElementById('glcanvas') as HTMLCanvasElement;
const gl = glCanvas.getContext('webgl2');
if (!gl) {
  throw new Error('Could not create webgl context.');
}

const vsSrc = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`;

const fsSrc = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

const prog = ininitShaderProgram(gl, vsSrc, fsSrc);

type Info = typeof info;

const info = {
  program: prog,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(prog, 'aVertexPosition'),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(prog, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(prog, 'uModelViewMatrix'),
  },
};

const buffers = initBuffers(gl);
drawScene(gl, info, buffers);

function ininitShaderProgram(
  gl: WebGL2RenderingContext,
  vsSrc: string,
  fsSrc: string
) {
  const vs = loadShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsSrc);

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog);
    throw new Error(`Error linking shader program: ${log}`);
  }

  return prog;
}

function loadShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);

  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    throw new Error(`Error compiling shader: ${log}`);
  }

  return sh;
}

type Buffers = ReturnType<typeof initBuffers>;

function initBuffers(gl: WebGL2RenderingContext) {
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);

  const pos = [1, 1, -1, 1, 1, -1, -1, -1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  return { position: posBuf };
}

function drawScene(gl: WebGL2RenderingContext, info: Info, buffers: Buffers) {
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fov = 45 * (Math.PI / 180);
  const aspect =
    (gl.canvas as HTMLCanvasElement).clientWidth /
    (gl.canvas as HTMLCanvasElement).clientHeight;
  const zNear = 0.1;
  const zFar = 100;

  const proj = mat4.create();
  mat4.perspective(proj, fov, aspect, zNear, zFar);
  mat4.translate(proj, proj, [0, 0, -6]);

  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      info.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(info.attribLocations.vertexPosition);
  }

  gl.useProgram(info.program);
}
