import { Utils } from "@orbifold/utils";
import { Message } from "./Message";

/**
 * Represents a data message to be visualized in some form.
 */
export class DataMessage extends Message {
  public typeName: string = "DataMessage";

  constructor(
    public data: any,
    public renderType: string = "data",
    public renderOptions: any = {},
    id: string = Utils.id()
  ) {
    super(id);
  }

  static fromString(text: string): DataMessage {
    return new DataMessage(JSON.parse(text));
  }
  /**
   * Creates a DataMessage instance from a JSON object.
   * @param json - The JSON object representing the DataMessage.
   * @returns A DataMessage instance.
   * @throws Error if the JSON is empty.
   */
  public static fromJson(json: any): DataMessage {
    if (Utils.isEmpty(json)) {
      throw new Error("JSON is empty");
    }
    const message = new DataMessage(json.data);
    message.id = json.id || Utils.id();
    message.renderType = json.renderType || "data";
    message.renderOptions = json.renderOptions || {};
    return message;
  }

  /**
   * Converts the DataMessage instance to a JSON object.
   * @returns The JSON object representing the DataMessage.
   */
  public toJSON(): any {
    return {
      ...super.toJSON(),
      data: this.data,
    };
  }
}
