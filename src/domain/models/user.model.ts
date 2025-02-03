export class User {
    constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly email: string,
      public readonly password: string, 
    ) {
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