// src/users/dto/update-user-detail.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateUserDetailDto } from './create-user-detail.dto';

export class UpdateUserDetailDto extends PartialType(CreateUserDetailDto) {}
