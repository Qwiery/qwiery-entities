import { Utils } from "@orbifold/utils";
import {TextMessage} from "./TextMessage";
import {ErrorMessage} from "./ErrorMessage";

export   class WarningMessage extends TextMessage {
  public typeName: string = "WarningMessage";
  constructor(public error: Error, id: string = Utils.id()) {
    super(error.message, id);
  }

  static fromString(msg: string): ErrorMessage {
    return new ErrorMessage(new Error(msg));
  }
}
