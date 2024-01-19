import { Utils } from "@orbifold/utils";
import { Message } from "./Message";

/**
 * Represents a text message.
 */
export class MarkdownMessage extends Message {
  public typeName: string = "MarkdownMessage";
  constructor(public text: string = "", id: string = Utils.id()) {
    super(id);
  }

  static fromString(text: string): MarkdownMessage {
    return new MarkdownMessage(text);
  }
  /**
   * Creates a MarkdownMessage instance from a JSON object.
   * @param json - The JSON object representing the MarkdownMessage.
   * @returns A MarkdownMessage instance.
   * @throws Error if the JSON is empty.
   */
  public static fromJson(json: any): MarkdownMessage {
    if (Utils.isEmpty(json)) {
      throw new Error("JSON is empty");
    }
    const message = new MarkdownMessage(json.text);
    message.id = json.id || Utils.id();
    return message;
  }

  /**
   * Converts the MarkdownMessage instance to a JSON object.
   * @returns The JSON object representing the MarkdownMessage.
   */
  public toJSON(): any {
    return {
      ...super.toJSON(),
      text: this.text,
    };
  }
}
