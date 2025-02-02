// import { Injectable } from '@nestjs/common';
// // import { v4 as uuidv4 } from 'uuid'; 
// import { v7 as uuidv7 } from 'uuid'; 


// @Injectable()
// export class IdGeneratorService {
//   generateId(): string {
//     return uuidv7();
//   }
// }


export abstract class IdGeneratorService {
  abstract generateId(): string;
} 