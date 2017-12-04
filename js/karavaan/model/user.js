
class User {
    name: string;
    external: boolean;
    constructor(name: string, external: boolean = false) {
      this.name = name;
      this.external = external;
    }
    equalsProps(user: User) {
      if (!user) return false;
      if (this.name != user.name) return false;
      return this.external = user.external;
    }
    static areEntriesEqual(user1: User, user2: User) {
      if ((!user1) != (!user2)) return false;
      if ((!user1.name) != (!user2.name)) return false;
      if (user1.name.toLowerCase() != user2.name.toLowerCase()) return false;
      return user1.external == user2.external;
    }
    static fromObject(data: User): User {
      return Object.assign(new User(), data);
    }
}

export default User;
