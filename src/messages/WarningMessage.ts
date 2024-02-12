import { Utils } from "@orbifold/utils";
import { TextMessage } from "./TextMessage";
import { ErrorMessage } from "./ErrorMessage";

/**
 * Represents a warning message.
 */
export class WarningMessage extends TextMessage {
  public typeName: string = "WarningMessage";

  constructor(text: string, id: string = Utils.id()) {
    super(text, id);
  }

  /**
   * Creates a WarningMessage from a string.
   * @param msg The warning message string.
   * @returns A new instance of WarningMessage.
   */
  static fromString(msg: string): WarningMessage {
    return new WarningMessage(msg);
  }
  public static fromJson(json: any): WarningMessage {
    if (Utils.isEmpty(json)) {
      throw new Error("JSON is empty");
    }
    const message = new WarningMessage(json.text);
    message.id = json.id || Utils.id();
    message.isOutput = json.isOutput || false;
    message.correlationId = json.correlationId;
    return message;
  }

  /**
   * Converts the TextMessage instance to a JSON object.
   * @returns The JSON object representing the TextMessage.
   */
  public toJSON(): any {
    return {
      typeName: this.typeName,
      ...super.toJSON()

    };
  }
}
