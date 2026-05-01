import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePrimaryRoleDto {
    @ApiProperty({ example: 1, description: 'UserType ID to set as primary (e.g. 1=Agent, 2=Seller)' })
    @IsInt()
    @IsNotEmpty()
    userTypeId: number;
}
