export function getTexture(gl: WebGL2RenderingContext, url: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    const texture = gl.createTexture();
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      const level = 0;
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        img
      );
      resolve(texture);
    };
  });
}

export function getTextureBuffer(gl: WebGL2RenderingContext) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const coordinates = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordinates), gl.STATIC_DRAW);
  return buffer;
}
