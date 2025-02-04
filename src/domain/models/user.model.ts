import { DomainEvent } from "../abstractions/domain-event/domain-event.base";
import { EntityBase } from "../abstractions/domain-event/entity-base";
import { UserCreatedDomainEvent } from "./domain-events/user/user-created-domain.event";
import { UserRegisteredDomainEvent } from "./domain-events/user/user-registered.domain.event";

export class UserModel extends EntityBase {
    constructor(
      private readonly _id: string,
      private readonly _name: string,
      private readonly _email: string,
      private readonly _password: string, 
    ) {
      super();
    }

    get id(): string {
      return this._id;
    }

    get name(): string {
      return this._name;
    }

    get email(): string {
      return this._email;
    }

    get password(): string {
      return this._password;
    }

   
    static create(id: string, name: string, email: string, password: string) {
      const userModel = new UserModel(id, name, email, password);
      userModel.addDomainEvent(new UserCreatedDomainEvent(userModel._id, userModel._email));
      return userModel;
    }

    static register(id: string, name: string, email: string, password: string) {
      const userModel = new UserModel(id, name, email, password);
      userModel.addDomainEvent(new UserRegisteredDomainEvent(userModel._id, userModel._email));
      return userModel;
    }


    
  }