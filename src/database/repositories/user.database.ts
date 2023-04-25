import { UserModel } from "../../app/models/user.model";
import { DatabaseConnection } from "../../main/database/typeorm.connection";
import { UserEntity } from "../../app/shared/database/entities/user.entity";
import { ErrandsDatabase } from "./errands.database";

export class UserDataBase {
  private repository = DatabaseConnection.connection.getRepository(UserEntity);

  private mapEntityToModel(entity: UserEntity): UserModel {
    const errandsEntity = entity.errands ?? [];

    const errands = errandsEntity.map((item) =>
      ErrandsDatabase.mapEntityToModel(item)
    );

    return UserModel.createModels(
      entity.id.trim(),
      entity.nome,
      entity.usuario,
      entity.senha,
      entity.confirmPassword,
      errands
    );
  }

  public async createDatabase(user: UserModel) {
    const userEntity = this.repository.create({
      id: user.id,
      nome: user.name,
      usuario: user.user,
      senha: user.password,
      confirmPassword: user.confirmPassword,
      dthrCriacao: new Date(),
    });

    const result = await this.repository.save(userEntity);

    return this.mapEntityToModel(result).toJson();
  }

  public async getID(id: string) {
    const result = await this.repository.findOneBy({
      id,
    });

    if (!result) {
      return null;
    }
    return this.mapEntityToModel(result);
  }
  public async getUser(usuario: string) {
    const result = await this.repository.findOne({
      where: { usuario },
    });
    return result;
  }
  public async login(user: string, password: string): Promise<any> {
    const result = await this.repository.findOne({
      where: {
        usuario: user,
        senha: password,
      },
    });

    return result;
  }
}
