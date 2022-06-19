import { ApiProperty } from '@nestjs/swagger';

export class ConfigPayload {
  @ApiProperty({ type: String, required: true, example: 'tiki_url' })
  name: string;

  @ApiProperty({ type: String, required: true, example: 'https://tiki.vn' })
  value: string;

  public static from(dto: Partial<ConfigPayload>) {
    const result = new ConfigPayload();
    result.name = dto.name;
    result.value = dto.value;
    return result;
  }
}
