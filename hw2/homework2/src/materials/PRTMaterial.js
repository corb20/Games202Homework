class PRTMaterial extends Material {

    constructor(vertexShader, fragmentShader) {
        //super的第一个参数是uniforms，第二个参数是attribs,对于PTR，uniform是Light的属性，分RGB，是三个向量，attribs是Tranport的属性，是一个向量
        super({
            // Phong
            'uPrecomputeLR': { type: 'updatedInRealTime', value: null },
            'uPrecomputeLG': { type: 'updatedInRealTime', value: null },
            'uPrecomputeLB': { type: 'updatedInRealTime', value: null },

        }, ['aPrecomputeLT'], vertexShader, fragmentShader, null);
    }
}

async function buildPRTMaterial(vertexPath, fragmentPath) {


    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new PRTMaterial(vertexShader, fragmentShader);

}