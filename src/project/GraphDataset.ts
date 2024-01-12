import { GraphLike,Utils } from "@orbifold/utils";
import { Dataset } from "./Dataset";


export class GraphDataset extends Dataset {
	public typeName = "GraphDataset";
	public graph: GraphLike = {
		nodes: [],
		edges: [],
	};

	constructor(public name: string = "New Graph Dataset", public description: string = "", public id: string = Utils.id()) {
		super(name, description, id);
	}

	public toJSON() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			graph: _.cloneDeep(this.graph),
			typeName: this.typeName,
		};
	}

	static fromJSON(json: any) {
		if (Utils.isEmpty(json)) {
			throw new Error("Cannot create a GraphDataset from an empty object.");
		}
		const dataset = new GraphDataset(json.name, json.description, json.id);
		dataset.graph = json.graph;
		return dataset;
	}
}
