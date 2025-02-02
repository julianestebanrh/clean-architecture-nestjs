import { User } from '@/domain/models/user.model';
import { UserRepository } from '@/domain/repositories/user.repository';
import { AuthService } from '@/domain/services/auth.service';
import { IdGeneratorService } from '@/domain/abstractions/generate-id/id-generator.service';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthServiceImpl implements AuthService {


  private readonly logger = new Logger(AuthServiceImpl.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      return null;
    }
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(name: string, email: string, password: string): Promise<{ accessToken: string }> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = this.idGeneratorService.generateId();
      const user = User.register(id, name, email, hashedPassword);

      await this.userRepository.create(user);
      return {
        accessToken: this.jwtService.sign({ email: user.email, sub: user.id }),
      };
    } catch (error) {
      return null;
    }
  }
}