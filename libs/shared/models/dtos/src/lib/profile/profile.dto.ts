import {ApiProperty} from "@nestjs/swagger";

export class ProfileUpdateResponse {
  @ApiProperty({ type: Boolean, default: true})
  success: boolean;
}

export class ProfileUpdateRequest {
  @ApiProperty({type : String, example: "lenguyenkhoi21", required: true})
  username : string;

  @ApiProperty({ type: String, example: "Lê Nguyên Khôi", required: false})
  fullname: string;

  @ApiProperty({ type: String, example: "lenguyenkhoi21@gmail.com", required: false})
  email: string;

  @ApiProperty({type: String, example: "077770xxxx", required: false})
  phoneNumber: string;

  @ApiProperty({type: String, example: 'link', required: false})
  imgUrl: string;
}
