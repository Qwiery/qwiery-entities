import { Utils } from "@orbifold/utils";
import { Message } from "./Message";

/**
 * Represents an image.
 */
export class ImageMessage extends Message {
	public typeName: string = "ImageMessage";

	constructor(public url: string = "", id: string = Utils.id()) {
		super(id);
	}

	static fromString(url: string): ImageMessage {
		return new ImageMessage(url);
	}

	/**
	 * Creates a ImageMessage instance from a JSON object.
	 * @param json - The JSON object representing the ImageMessage.
	 * @returns A ImageMessage instance.
	 * @throws Error if the JSON is empty.
	 */
	public static fromJson(json: any): ImageMessage {
		if (Utils.isEmpty(json)) {
			throw new Error("JSON is empty");
		}
		const message = new ImageMessage(json.url);
		message.id = json.id || Utils.id();
		return message;
	}

	/**
	 * Converts the ImageMessage instance to a JSON object.
	 * @returns The JSON object representing the ImageMessage.
	 */
	public toJSON(): any {
		return {
			...super.toJSON(),
			url: this.url,
		};
	}
}
