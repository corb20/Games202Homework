attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;
attribute mat3 aPrecomputeLT;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform mat3 uPrecomputeLR;
uniform mat3 uPrecomputeLG;
uniform mat3 uPrecomputeLB;

varying highp vec2 vTextureCoord;
varying highp vec3 vFragPos;
varying highp vec3 vNormal;

//在这一步计算点乘，通过插值计算具体每个像素的颜色
varying vec3 vColor;

float LTDot(mat3 Light, mat3 TransPort){
    return dot(Light[0],TransPort[0])+dot(Light[1],TransPort[1])+dot(Light[2],TransPort[2]);
}

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix *
                vec4(aVertexPosition, 1.0);
    vColor=vec3(LTDot(aPrecomputeLT,uPrecomputeLR),LTDot(aPrecomputeLT,uPrecomputeLG),LTDot(aPrecomputeLT,uPrecomputeLB))/3.1415926;
}