const { S3 } = require("aws-sdk");
const uuid = require("uuid").v4;

// aws v2
exports.s3Uploadv2 = async (files) => {
	// files 는 multer file 객체 배열이다.

  const s3 = new S3();

  const params = files.map((file) => {
		// file 은 실제 file 객체 하나 하나를 나타낸다.
		// 즉, 여기서는 file 을 여러개 업로드하는 것
    return {
      Bucket: process.env.AWS_BUCKET_NAME, // 업로드하려는 버킷 이름 작성
      Key: `media/${uuid()}-${file.originalname}`, // media 폴더 아래에 커스텀한 이름으로 업로드
      Body: file.buffer, // 실제 파일이 있는 위치, 클라이언트한테 받은 파일을 현재 머신의 메모리에 저장한 후 버퍼로 저장한 다음 AWS 에 제공한다.
    };
  });

  return await Promise.all(params.map((param) => s3.upload(param).promise()));
};