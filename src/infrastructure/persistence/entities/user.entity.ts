import { AggregateRoot } from '@/domain/abstractions/domain-event/aggregate-root';
import { UserCreatedDomainEvent } from '@/domain/models/domain-events/user/user-created-domain.event';
import { UserRegisteredDomainEvent } from '@/domain/models/domain-events/user/user-registered.domain.event';
import { User } from '@/domain/models/user.model';
import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity extends AggregateRoot {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;


  constructor(id: string, name: string, email: string, password: string) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

   // Método para convertir de Entidad a Modelo de dominio
   toDomain(): User {
    return new User(this.id, this.name, this.email, this.password);
  }

  // Método para convertir de Modelo de dominio a Entidad
  static fromDomain(user: User): UserEntity {
    const entity = new UserEntity(user.id, user.name, user.email, user.password);
    return entity;
  }

  static create(user: User): UserEntity {
    const entity = new UserEntity(user.id, user.name, user.email, user.password);
    entity.addDomainEvent(new UserCreatedDomainEvent(entity.id));

    return entity;
  }

  static register(id: string, name: string, email: string, password: string) : UserEntity {
    const entity = new UserEntity(id, name, email, password);
    entity.addDomainEvent(new UserRegisteredDomainEvent(entity.id));
    return entity;
  }

  static update(user: User): UserEntity {
    const entity = new UserEntity(user.id, user.name, user.email, user.password);
    return entity;
  }
}


