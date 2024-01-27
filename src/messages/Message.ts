import { Utils } from "@orbifold/utils";

/**
 * Represents a base message.
 */

export   class Message {
  public typeName = "Message";
  public isOutput = false;
  constructor(public id: string = Utils.id(), public annotations = {}) { }

  /**
   * Creates a Message instance from a JSON object.
   * @param json - The JSON object representing the message.
   * @returns A new Message instance.
   */
  public static fromJson(json: any): Message {
    const message = new Message();
    message.id = json.id || Utils.id();
    message.annotations = json.annotations || {};
    message.isOutput = json.isOutput || false;
    return message;
  }

  /**
   * Converts the Message instance to a JSON object.
   * @returns The JSON representation of the message.
   */
  public toJSON(): any {
    return {
      id: this.id,
      typeName: this.typeName,
      annotations: this.annotations,
      isOutput: this.isOutput,
    };
  }
}
