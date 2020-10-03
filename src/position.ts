export function getBuffer(gl: WebGL2RenderingContext) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const pos = [1, 1, -1, 1, 1, -1, -1, -1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  return buffer;
}
