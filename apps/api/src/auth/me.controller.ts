import { Controller, Get, Header } from '@nestjs/common';
import type { User } from '../users/user';
import { CurrentUser } from './current-user.decorator';

@Controller('me')
export class MeController {
  @Get()
  @Header('Cache-Control', 'no-store')
  getMe(@CurrentUser() user: User): Pick<User, 'id' | 'name' | 'email' | 'role'> {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
