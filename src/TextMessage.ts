import { Utils } from "@orbifold/utils";
import {Message} from "./Message";

/**
 * Represents a text message.
 */

export   class TextMessage extends Message {
  public typeName: string = "TextMessage";
  constructor(public text: string = "", id: string = Utils.id()) {
    super(id);
  }

  static fromString(text: string): TextMessage {
    return new TextMessage(text);
  }
  /**
   * Creates a TextMessage instance from a JSON object.
   * @param json - The JSON object representing the TextMessage.
   * @returns A TextMessage instance.
   * @throws Error if the JSON is empty.
   */
  public static fromJson(json: any): TextMessage {
    if (Utils.isEmpty(json)) {
      throw new Error("JSON is empty");
    }
    const message = new TextMessage(json.text);
    message.id = json.id || Utils.id();
    return message;
  }

  /**
   * Converts the TextMessage instance to a JSON object.
   * @returns The JSON object representing the TextMessage.
   */
  public toJSON(): any {
    return {
      ...super.toJSON(),
      text: this.text,
    };
  }
}
