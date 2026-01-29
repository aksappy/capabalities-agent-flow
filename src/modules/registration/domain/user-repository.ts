export interface User {
  email: string;
  hashedPassword: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
