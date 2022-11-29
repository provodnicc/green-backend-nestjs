import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class SignUpDto
{
    @IsNotEmpty()
    @ApiProperty({default: 'default@email.com'})
    email: string

    @IsNotEmpty()
    @ApiProperty({default: 'default'})
    password: string
}