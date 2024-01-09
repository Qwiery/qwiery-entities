import {CommandMessage} from "./CommandMessage";
import {ErrorMessage} from "./ErrorMessage";
import {TextMessage} from "./TextMessage";
import {Message} from "./Message";


export class MessageFactory {
  static fromString(text: string): TextMessage {
    return new TextMessage(text);
  }
  static fromError(error: Error | string): ErrorMessage {
    if (typeof error === "string") {
      return new ErrorMessage(error);
    }
    return new ErrorMessage(error.message);
  }
  static fromAny(something: any): Message | Message[] | null {
    if (something instanceof Message) {
      return something;
    }
    if (something instanceof Error) {
      return MessageFactory.fromError(something);
    }
    if (typeof something === "string") {
      return MessageFactory.fromString(something);
    }
    if (something instanceof Array) {
      if (something.length === 0) {
        return null;
      }
      const firstItem = something[0];
      if (firstItem instanceof Message) {
        return something;
      }
      if (firstItem instanceof Error) {
        return something.map((error: Error) => MessageFactory.fromError(error));
      }
      if (typeof firstItem === "string") {
        return something.map((text: string) => MessageFactory.fromString(text));
      }
    }
    return null;
  }
  static fromCommand(comandName: string, args: string[] = []): CommandMessage {
    return new CommandMessage(comandName, args);
  }
}
