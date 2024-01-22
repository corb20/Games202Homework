attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uLightMVP;

varying highp vec2 vTextureCoord;
varying highp vec3 vFragPos;
varying highp vec3 vNormal;
varying highp vec4 vPositionFromLight;

void main(void) {

  const float offset=0.0;

  vFragPos = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz;
  vNormal = (uModelMatrix * vec4(aNormalPosition, 0.0)).xyz;

  
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix *
                vec4(aVertexPosition, 1.0);

  vec4 transNorm=uProjectionMatrix*uViewMatrix*uModelMatrix*vec4(vNormal,1.0) ;
  
  if(vNormal.z < 0.0){
    //表示该点面向相机
    //gl_Position.xy += transNorm.xy*offset;
  }

  vTextureCoord = aTextureCoord;
  vPositionFromLight = uLightMVP * vec4(aVertexPosition, 1.0);
}