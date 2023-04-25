import { Request, Response } from "express";
import { UserDataBase } from "../database/repositories/user.database";
import { ErrorServer } from "../app/shared/erros/server.error";
import { UserModel } from "../app/models/user.model";
import { SuccessResponse } from "../app/shared/success/success";

export class userController {
  public async createUser(req: Request, res: Response) {
    try {
      const { name, user, password, confirmPassword } = req.body;

      const newUser = new UserModel(name, user, password, confirmPassword);
      const database = new UserDataBase();

      // const databaseGetUser = await database.getUser(user);
      // if (databaseGetUser) {
      //   return res.status(400).send({
      //     ok: false,
      //     message: "User already exists (Usuario já existe)",
      //   });
      // }

      if (
        name === "" ||
        user === "" ||
        password === "" ||
        confirmPassword === ""
      ) {
        return res.status(404).send({
          ok: false,
          message: "Fill in the fields (preencha os campos)",
        });
      }
      if (password.length < 5 || confirmPassword.length < 5) {
        return res.status(404).send({
          ok: false,
          message:
            " Password needs at least 5 characters (A senha precisa de pelo menos 5 caracteres)",
        });
      }
      if (user.length < 5) {
        return res.status(404).send({
          ok: false,
          message:
            " The user needs at least 5 characters (O usuário precisa de pelo menos 5 caracteres)",
        });
      }

      if (password !== confirmPassword) {
        return res.status(404).send({
          ok: false,
          message: " Password does not match(Senha não confere)",
        });
      }

      const result = await database.createDatabase(newUser);
      return SuccessResponse.createSuccess(
        res,
        "User was successfully create(O usuário foi criado com sucesso)",
        result
      );
    } catch (error: any) {
      return ErrorServer.errorServerProcessing(res, error);
    }
  }

  public async loginUser(req: Request, res: Response) {
    try {
      const { user, password } = req.body;
      const database = new UserDataBase();

      const result = await database.login(user, password);
      if (!result) {
        return res.status(401).send({
          ok: false,
          message: "Invalid credentials",
        });
      }

      return res.status(200).send({
        ok: true,
        message: "Login successfully done",
        data: result,
      });
    } catch (error: any) {
      return ErrorServer.errorServerProcessing;
    }
  }
}
