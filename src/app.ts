import { gl } from './context.js';
import { Builder } from './builder.js';
import { load } from './load.js';
import { getMatrixes } from './matrix.js';

run().catch((e) => console.error(e));

async function run() {
  const program = await createProgram();

  const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  const aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');

  const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  const uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');

  const uSampler = gl.getUniformLocation(program, 'uSampler');

  const pos = initPos();
  const tex = initTex();
  const ind = initInd();

  const texture = loadTexture();

  {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  const { modelViewMatrix: mv, projectionMatrix: pj } = getMatrixes();

  {
    gl.bindBuffer(gl.ARRAY_BUFFER, pos);
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);
  }

  {
    gl.bindBuffer(gl.ARRAY_BUFFER, tex);
    gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aTextureCoord);
  }

  {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ind);
  }

  gl.useProgram(program);

  {
    gl.uniformMatrix4fv(uProjectionMatrix, false, pj);
    gl.uniformMatrix4fv(uModelViewMatrix, false, mv);
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(uSampler, 0);

  {
    const vertexCount = 6;
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
  }
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

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn of mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = 'data/sample.png';

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
