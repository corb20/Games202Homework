//长度为9的向量使用3*3的矩阵表示，这样只是为了算的快
precision mediump float;

varying vec3 vColor;

void main(){
    gl_FragColor=vec4(vColor,1.0);
    return;
}