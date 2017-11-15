
class User {
    name: string;
    external: boolean;
    constructor(name: string, external: boolean = false) {
      this.name = name;
      this.external = external;
    }
}

export default User;
