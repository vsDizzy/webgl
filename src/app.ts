import { gl } from './context.js';
import { Builder } from './builder.js';
import { load } from './load.js';

run().catch((e) => console.error(e));

async function run() {
  const program = await createProgram();

  const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  const aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');

  const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  const uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');

  const uSampler = gl.getUniformLocation(program, 'uSampler');

  gl.useProgram(program);
}

async function createProgram() {
  const [vs, fs] = await Promise.all([
    load('data/vertex.glsl'),
    load('data/frag.glsl'),
  ]);

  const builder = new Builder();
  builder.compile(gl.VERTEX_SHADER, vs);
  builder.compile(gl.FRAGMENT_SHADER, fs);
  const program = builder.link();
  builder.dispose();

  return program;
}
