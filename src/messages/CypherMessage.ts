import { Utils } from "@orbifold/utils";
import { Message } from "./Message";


export class CypherMessage extends Message {
	public typeName: string = "CypherMessage";

	constructor(public query: string = "", public visualization: string = "grid", public database: string = "", id: string = Utils.id()) {
		super(id);
	}


	/**
	 * Creates a CypherMessage instance from a JSON object.
	 * @param json - The JSON object representing the CypherMessage.
	 * @returns A CypherMessage instance.
	 * @throws Error if the JSON is empty.
	 */
	public static fromJson(json: any): CypherMessage {
		if (Utils.isEmpty(json)) {
			throw new Error("JSON is empty");
		}
		const message = new CypherMessage(json.query, json.visualization, json.database, json.id);
		message.isOutput = json.isOutput || false;
		message.correlationId = json.correlationId;
		return message;
	}

	/**
	 * Converts the CypherMessage instance to a JSON object.
	 * @returns The JSON object representing the CypherMessage.
	 */
	public toJSON(): any {
		return {
			...super.toJSON(),
			query: this.query,
			visualization: this.visualization,
			database: this.database,
			isOutput: this.isOutput,
			correlationId: this.correlationId,

		};
	}
}
