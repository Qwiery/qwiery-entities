import { Utils } from "@orbifold/utils";
import { Message } from "./Message";

/**
 * Represents a message for testing and debugging purposes.
 */
export class DebugMessage extends Message {
	public typeName: string = "DebugMessage";

	constructor(public text: string = "", id: string = Utils.id()) {
		super(id);
	}

	static empty(): DebugMessage {
		return new DebugMessage();
	}

	static fromString(text: string): DebugMessage {
		return new DebugMessage(text);
	}

	/**
	 * Creates a DebugMessage instance from a JSON object.
	 * @param json - The JSON object representing the DebugMessage.
	 * @returns A DebugMessage instance.
	 * @throws Error if the JSON is empty.
	 */
	public static fromJson(json: any): DebugMessage {
		if (Utils.isEmpty(json)) {
			throw new Error("JSON is empty");
		}
		const message = new DebugMessage(json.text);
		message.id = json.id || Utils.id();
		message.isOutput = json.isOutput || false;
		message.correlationId = json.correlationId;
		return message;
	}

	/**
	 * Converts the DebugMessage instance to a JSON object.
	 * @returns The JSON object representing the DebugMessage.
	 */
	public toJSON(): any {
		return {
			...super.toJSON(),
			text: this.text,
			isOutput: this.isOutput,
			correlationId: this.correlationId,

		};
	}
}
