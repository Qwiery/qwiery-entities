import { Utils } from "@orbifold/utils";
import {TextMessage}  from "./TextMessage";


export   class ErrorMessage extends TextMessage {
  public typeName: string = "ErrorMessage";
  constructor(public error: Error, id: string = Utils.id()) {
    super(error.message, id);
  }
  static fromError(error: Error): ErrorMessage {
    return new ErrorMessage(error);
  }
  static fromString(msg: string): ErrorMessage {
    return new ErrorMessage(new Error(msg));
  }
}
