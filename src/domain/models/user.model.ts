import { AggregateRoot } from "../abstractions/domain-event/aggregate-root";
import { UserCreatedDomainEvent } from "./domain-events/user/user-created-domain.event";
import { UserRegisteredDomainEvent } from "./domain-events/user/user-registered.domain.event";

export class User {
    constructor(
      public id: string,
      public name: string,
      public email: string,
      public password: string, 
    ) {
    }


    setId(id: string) {
      this.id = id;
    }


    static create(id: string, name: string, email: string, password: string) {
      const user = new User(id, name, email, password);

      return user;
    }

    static register(id: string, name: string, email: string, password: string) {
      const user = new User(id, name, email, password);
      return user;
    }
    
  }