const glCanvas = document.getElementById('glcanvas') as HTMLCanvasElement;
export const gl = glCanvas.getContext('webgl');
if (!gl) {
  throw new Error('Could not create webgl context.');
}

export const aspect = glCanvas.clientWidth / glCanvas.clientHeight;
