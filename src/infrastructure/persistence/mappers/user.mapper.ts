import { UserModel } from "@domain/models/user.model";
import { UserEntity } from "../entities/user.entity";

export class UserMapper {
    static toDomain(entity: UserEntity): UserModel {
        const model = UserModel.create(entity.id, entity.name, entity.email, entity.password);
        return model;
    }

    static toEntity(model: UserModel): UserEntity {
        const entity = UserEntity.create(model);

        entity.addDomainEvents(model.domainEvents);
        return entity;
    }
}