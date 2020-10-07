import { Builder } from './builder.js';
import { load } from './load.js';
import { getMatrixes } from './matrix.js';
import { getBuffer } from './position.js';
import { getTexture, getTextureBuffer } from './texture.js';

const glCanvas = document.getElementById('glcanvas') as HTMLCanvasElement;
const gl = glCanvas.getContext('webgl2');
if (!gl) {
  throw new Error('Could not create webgl context.');
}

run().catch((e) => console.error(e));

async function run() {
  const [vs, fs] = await Promise.all([
    load('data/vertex.glsl'),
    load('data/frag.glsl'),
  ]);

  const builder = new Builder(gl);
  builder.compile(gl.VERTEX_SHADER, vs);
  builder.compile(gl.FRAGMENT_SHADER, fs);
  const program = builder.link();

  const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  const aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');

  const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  const uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
  const uSampler = gl.getUniformLocation(program, 'uSampler');

  init(gl);
  const posBuffer = getBuffer(gl);

  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(
      aVertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(aVertexPosition);
  }

  gl.useProgram(program);

  {
    const { projectionMatrix, modelViewMatrix } = getMatrixes(
      glCanvas.clientWidth / glCanvas.clientHeight
    );

    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
  }

  {
    const texBuffer = getTextureBuffer(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aTextureCoord);
  }

  {
    const texture = getTexture(gl, 'data/sample.png');

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uSampler, 0);
  }

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

function init(gl: WebGL2RenderingContext) {
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
