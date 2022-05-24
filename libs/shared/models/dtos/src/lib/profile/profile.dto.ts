import {ApiProperty} from "@nestjs/swagger";

export class ProfileUpdateResponse {
  @ApiProperty({ type: Boolean, default: true})
  success: boolean;
}

export class ProfileUpdateRequest {
  @ApiProperty({ type: String, example: "Lê Nguyên Khôi", required: true})
  fullname: string;

  @ApiProperty({ type: String, example: "lenguyenkhoi21@gmail.com", required: true})
  email: string;

  @ApiProperty({type: String, example: "077770xxxx", required: true})
  phoneNumber: string;
}
