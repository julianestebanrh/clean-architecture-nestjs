import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@domain/repositories/user.repository';
import { UserModel } from '@domain/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository, // Repositorio para buscar el usuario
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header "Authorization"
      ignoreExpiration: false, // Rechaza tokens expirados
      secretOrKey: configService.get<string>('JWT_SECRET'), // Clave secreta para validar el token
    });
  }

  /**
   * Valida el payload del token JWT.
   * Este método se ejecuta automáticamente después de que Passport valida el token.
   *
   * @param payload - El payload decodificado del token JWT.
   * @returns El usuario correspondiente al token.
   * @throws UnauthorizedException - Si el usuario no existe o el token es inválido.
   */
  async validate(payload: any): Promise<UserModel> {
    // El payload contiene la información que incluiste al firmar el token (por ejemplo, el userId)
    const { sub: userId } = payload;

    // Busca el usuario en la base de datos usando el userId del payload
    const user = await this.userRepository.findById(userId);

    // Si el usuario no existe, lanza una excepción
    if (!user) {
      throw new UnauthorizedException('Invalid token: User not found');
    }

    // Devuelve el usuario. Passport lo adjuntará al objeto `req.user` en la solicitud.
    return user;
  }
}