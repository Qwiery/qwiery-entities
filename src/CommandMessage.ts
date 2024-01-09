import { Utils } from "@orbifold/utils";
import {Message} from "./Message";

/**
 * Represents a command message.
 */
export   class CommandMessage extends Message {
  public typeName: string = "CommandMessage";
  /**
   * Creates a new instance of CommandMessage.
   * @param command The command string.
   * @param args The arguments for the command.
   * @param id The unique identifier for the message.
   */
  constructor(
    public command: string,
    public args: string[] = [],
    public id: string = Utils.id()
  ) {
    super();
  }
  /**
   * Creates a CommandMessage instance from a string.
   * @param command The command string.
   * @returns A new CommandMessage instance.
   */
  static fromString(command: string): CommandMessage {
    return new CommandMessage(command);
  }
  /**
   * Creates a CommandMessage instance from a JSON object.
   * @param json The JSON object representing the CommandMessage.
   * @returns A new CommandMessage instance.
   */
  static fromJson(json: any): CommandMessage {
    const message = new CommandMessage(json.command, json.args || []);
    message.id = json.id || Utils.id();
    return message;
  }
  /**
   * Returns a string representation of the CommandMessage.
   * @returns The string representation of the CommandMessage.
   */
  public toString(): string {
    return `!${this.command} ${this.args.join(" ")}`;
  }
  /**
   * Converts the CommandMessage to a JSON object.
   * @returns The JSON representation of the CommandMessage.
   */
  public toJSON(): any {
    return {
      ...super.toJSON(),
      command: this.command,
      args: this.args || [],
    };
  }
}
