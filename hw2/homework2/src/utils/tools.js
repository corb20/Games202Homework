//precomputeL: 9*3，行表示阶，列表示RGB
function getRotationPrecomputeL(precompute_L, rotationMatrix){
	//将rotationMatrix 一个长度为16的数组转化成4*4矩阵
	let rotationMat=mat4Matrix2mathMatrix(rotationMatrix);
	let S3x3=computeSquareMatrix_3by3(rotationMat);
	let S5x5=computeSquareMatrix_5by5(rotationMat);
	///result是一个9*3的矩阵
	let result=[];
	for(let i=0;i<9;i++){
		let r=[];
		for(let j=0;j<3;j++){
			r.push(precompute_L[i][j]);
		}
		result.push(r);
	}

	let L3x3=math.matrix([
		[precompute_L[1][0], precompute_L[1][1], precompute_L[1][2]],
		[precompute_L[2][0], precompute_L[2][1], precompute_L[2][2]],
		[precompute_L[3][0], precompute_L[3][1], precompute_L[3][2]],
	])
	let L5x3=math.matrix([
		[precompute_L[4][0], precompute_L[4][1], precompute_L[4][2]],
		[precompute_L[5][0], precompute_L[5][1], precompute_L[5][2]],
		[precompute_L[6][0], precompute_L[6][1], precompute_L[6][2]],
		[precompute_L[7][0], precompute_L[7][1], precompute_L[7][2]],
		[precompute_L[8][0], precompute_L[8][1], precompute_L[8][2]],
	])
	//不同阶数分别执行旋转
	let R_L3x3=math.multiply(S3x3, L3x3);
	let R_L5x3=math.multiply(S5x5, L5x3);

	for(let i=0;i<3;i++){
		for(let j=0;j<3;j++){
			result[i+1][j]=R_L3x3._data[i][j];
		}
	}

	for(let i=0;i<5;i++){
		for(let j=0;j<5;j++){
			result[i+4][j]=R_L5x3._data[i][j];
		}
	}
	return result;
}

function computeSquareMatrix_3by3(rotationMatrix){ // 计算方阵SA(-1) 3*3 
	// 1、pick ni - {ni}
	let n1 = [1, 0, 0, 0]; let n2 = [0, 0, 1, 0]; let n3 = [0, 1, 0, 0];

	// 2、{P(ni)} - A  A_inverse
	let n1_sh=SHEval(n1[0], n1[1], n1[2], 3);
	let n2_sh=SHEval(n2[0], n2[1], n2[2], 3);
	let n3_sh=SHEval(n3[0], n3[1], n3[2], 3);

	let A=math.matrix([
		[n1_sh[1], n2_sh[1], n3_sh[1]],
		[n1_sh[2], n2_sh[2], n3_sh[2]],
		[n1_sh[3], n2_sh[3], n3_sh[3]],
	])
	let A_inverse=math.inv(A);
	// 3、用 R 旋转 ni - {R(ni)}
	let n1_rotate = math.multiply(rotationMatrix, n1);
	let n2_rotate = math.multiply(rotationMatrix, n2);
	let n3_rotate = math.multiply(rotationMatrix, n3);

	let n1_rotate_sh=SHEval(n1_rotate._data[0], n1_rotate._data[1], n1_rotate._data[2], 3);
	let n2_rotate_sh=SHEval(n2_rotate._data[0], n2_rotate._data[1], n2_rotate._data[2], 3);
	let n3_rotate_sh=SHEval(n3_rotate._data[0], n3_rotate._data[1], n3_rotate._data[2], 3);
	// 4、R(ni) SH投影 - S
	let S=math.matrix([
		[n1_rotate_sh[1], n2_rotate_sh[1], n3_rotate_sh[1]],
		[n1_rotate_sh[2], n2_rotate_sh[2], n3_rotate_sh[2]],
		[n1_rotate_sh[3], n2_rotate_sh[3], n3_rotate_sh[3]],
	])
	// 5、S*A_inverse
	let result=math.multiply(S, A_inverse);
	return result;
}

function computeSquareMatrix_5by5(rotationMatrix){ // 计算方阵SA(-1) 5*5
	
	// 1、pick ni - {ni}
	let k = 1 / math.sqrt(2);
	let n1 = [1, 0, 0, 0]; let n2 = [0, 0, 1, 0]; let n3 = [k, k, 0, 0]; 
	let n4 = [k, 0, k, 0]; let n5 = [0, k, k, 0];

	// 2、{P(ni)} - A  A_inverse
	let n1_sh=SHEval(n1[0], n1[1], n1[2], 3);
	let n2_sh=SHEval(n2[0], n2[1], n2[2], 3);
	let n3_sh=SHEval(n3[0], n3[1], n3[2], 3);
	let n4_sh=SHEval(n4[0], n4[1], n4[2], 3);
	let n5_sh=SHEval(n5[0], n5[1], n5[2], 3);

	let A=math.matrix([
		[n1_sh[4], n2_sh[4], n3_sh[4], n4_sh[4], n5_sh[4]],
		[n1_sh[5], n2_sh[5], n3_sh[5], n4_sh[5], n5_sh[5]],
		[n1_sh[6], n2_sh[6], n3_sh[6], n4_sh[6], n5_sh[6]],
		[n1_sh[7], n2_sh[7], n3_sh[7], n4_sh[7], n5_sh[7]],
		[n1_sh[8], n2_sh[8], n3_sh[8], n4_sh[8], n5_sh[8]],
	])

	let A_inverse=math.inv(A);

	// 3、用 R 旋转 ni - {R(ni)}
	let n1_rotate = math.multiply(rotationMatrix, n1);
	let n2_rotate = math.multiply(rotationMatrix, n2);
	let n3_rotate = math.multiply(rotationMatrix, n3);
	let n4_rotate = math.multiply(rotationMatrix, n4);
	let n5_rotate = math.multiply(rotationMatrix, n5);

	// 4、R(ni) SH投影 - S
	let n1_rotate_sh=SHEval(n1_rotate._data[0], n1_rotate._data[1], n1_rotate._data[2], 3);
	let n2_rotate_sh=SHEval(n2_rotate._data[0], n2_rotate._data[1], n2_rotate._data[2], 3);
	let n3_rotate_sh=SHEval(n3_rotate._data[0], n3_rotate._data[1], n3_rotate._data[2], 3);
	let n4_rotate_sh=SHEval(n4_rotate._data[0], n4_rotate._data[1], n4_rotate._data[2], 3);
	let n5_rotate_sh=SHEval(n5_rotate._data[0], n5_rotate._data[1], n5_rotate._data[2], 3);

	let S=math.matrix([
		[n1_rotate_sh[4], n2_rotate_sh[4], n3_rotate_sh[4], n4_rotate_sh[4], n5_rotate_sh[4]],
		[n1_rotate_sh[5], n2_rotate_sh[5], n3_rotate_sh[5], n4_rotate_sh[5], n5_rotate_sh[5]],
		[n1_rotate_sh[6], n2_rotate_sh[6], n3_rotate_sh[6], n4_rotate_sh[6], n5_rotate_sh[6]],
		[n1_rotate_sh[7], n2_rotate_sh[7], n3_rotate_sh[7], n4_rotate_sh[7], n5_rotate_sh[7]],
		[n1_rotate_sh[8], n2_rotate_sh[8], n3_rotate_sh[8], n4_rotate_sh[8], n5_rotate_sh[8]],
	
	])
	// 5、S*A_inverse
	let result=math.multiply(S, A_inverse);
	return result;
}

function mat4Matrix2mathMatrix(rotationMatrix){

	let mathMatrix = [];
	for(let i = 0; i < 4; i++){
		let r = [];
		for(let j = 0; j < 4; j++){
			r.push(rotationMatrix[i*4+j]);
		}
		mathMatrix.push(r);
	}
	return math.matrix(mathMatrix)

}

function getMat3ValueFromRGB(precomputeL){

    let colorMat3 = [];
    for(var i = 0; i<3; i++){
        colorMat3[i] = mat3.fromValues( precomputeL[0][i], precomputeL[1][i], precomputeL[2][i],
										precomputeL[3][i], precomputeL[4][i], precomputeL[5][i],
										precomputeL[6][i], precomputeL[7][i], precomputeL[8][i] ); 
	}
    return colorMat3;
}