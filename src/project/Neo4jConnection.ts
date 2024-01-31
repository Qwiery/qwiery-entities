export type ConnectionKeys="name"|"flavor"|"host"|"port"|"username"|"password"|"database"|"protocol";
export type Neo4jConnection = Record<ConnectionKeys, string | number | undefined>;

