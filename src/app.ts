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

  const pos = initPos();
  const tex = initTex();
  const ind = initInd();

  const texture = loadTexture();
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

function initPos() {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    -1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initTex() {
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  const textureCoordinates = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  );

  return textureCoordBuffer;
}

function initInd() {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  const indices = [0, 1, 2, 0, 2, 3];
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return indexBuffer;
}

function loadTexture() {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const pixel = new Uint8Array([
    0,
    255,
    0,
    0,
    0,
    255,
    0,
    0,
    0,
    255,
    0,
    0,
    0,
    255,
    0,
    0,
    0,
    255,
    0,
    0,
    0,
    255,
    0,
    0,
    0,
    255,
    0,
    0,
    0,
    255,
    0,
    0,
  ]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    8,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixel
  );

  return texture;
}
