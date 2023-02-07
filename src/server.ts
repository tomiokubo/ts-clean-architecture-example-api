import "reflect-metadata";
import { DbHelper } from "./infra/db/pg/db-helper";
import { setupApp } from "./main/config/app";

DbHelper.makeAppDataSource();

const AppDataSource = DbHelper.getAppDataSource();

AppDataSource?.initialize()
  .then(async () => {
    const app = await setupApp();
    app.listen(3001, () => console.log("Server running"));
  })
  .catch((error) => console.log(error));
