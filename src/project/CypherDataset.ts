import { Utils } from "@orbifold/utils";
import { Dataset } from "./Dataset";

export class CypherDataset extends Dataset {
	public typeName = "CypherDataset";
	public cypher: string = "";

	constructor(public name: string = "New Cypher Dataset", public description: string = "", public id: string = Utils.id()) {
		super(name, description, id);
	}

	public toJSON() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			cypher: this.cypher,
			typeName: this.typeName,
		};
	}

	static fromJSON(json: any) {
		if (Utils.isEmpty(json)) {
			throw new Error("Cannot create a CypherDataset from an empty object.");
		}
		const dataset = new CypherDataset(json.name, json.description, json.id);
		dataset.cypher = json.cypher;
		return dataset;
	}
}