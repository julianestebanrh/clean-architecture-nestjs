import { DomainEvent } from '@domain/abstractions/domain-event/domain-event.base';
import { EntityBase } from '@domain/abstractions/domain-event/entity-base';
import { UserModel } from '@domain/models/user.model';
import { Entity, Column, PrimaryColumn  } from 'typeorm';

@Entity('users')
export class UserEntity extends EntityBase {
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

  //  // Método para convertir de Entidad a Modelo de dominio
  //  toDomain(): UserModel {
  //     return UserModel.create(this.id, this.name, this.email, this.password);
  //   }


  // // Método para convertir de Modelo de dominio a Entidad
  // static fromDomain(model: UserModel): UserEntity {
  //   const entity = new UserEntity(model.id, model.name, model.email, model.password);
  //   return entity;
  // }

  static create(model: UserModel) : UserEntity {
    const entity = new UserEntity(model.id, model.name, model.email, model.password);
    return entity;
  }

  // static register(model: UserModel) : UserEntity {
  //   const entity = new UserEntity(model.id, model.name, model.email, model.password);
  //   return entity;
  // }

  // static update(model: UserModel): UserEntity {
  //   const entity = new UserEntity(model.id, model.name, model.email, model.password);
  //   return entity;
  // }



}


