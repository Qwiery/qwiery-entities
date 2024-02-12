import { Utils } from "@orbifold/utils";

/**
 * Represents a base message.
 */
export class Message {
	public typeName = "Message";
	/**
	 * A flag indicating whether the message is an output message.
	 * Typically, you set this to true to render the message as a result from some input.
	 * @type {boolean}
	 */
	public isOutput: boolean = false;
	/**
	 * The correlation id allows you to link a message to another message.
	 * Usually this corresponds to the message which triggered or generated the current message.
	 * @type {string}
	 */
	public correlationId: string | null = null;

	constructor(public id: string = Utils.id(), public annotations = {}) {
	}

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
		message.correlationId = json.correlationId;
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
			correlationId: this.correlationId,
		};
	}
}
