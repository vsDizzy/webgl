import { aspect } from './context.js';
import { mat4 } from 'gl-matrix';
export function getMatrixes() {
    const fov = 45 * (Math.PI / 180);
    const zNear = 0.1;
    const zFar = 100;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);
    return { projectionMatrix, modelViewMatrix };
}
