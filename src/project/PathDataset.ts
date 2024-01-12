import { Utils } from "@orbifold/utils";
import { Dataset } from "./Dataset";


/**
 * A PathDataset is a dataset based on a path-query.
 */
export class PathDataset extends Dataset {
	public typeName = "PathDataset";
	public pathQuery: string[] = [];

	constructor(public name: string = "New Path Dataset", public description: string = "", public id: string = Utils.id()) {
		super(name, description, id);
	}

	public toJSON() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			pathQuery: this.pathQuery,
			typeName: this.typeName,
		};
	}

	static fromJSON(json: any) {
		if (Utils.isEmpty(json)) {
			throw new Error("Cannot create a PathDataset from an empty object.");
		}
		const dataset = new PathDataset(json.name, json.description, json.id);
		dataset.pathQuery = json.pathQuery;
		return dataset;
	}
}