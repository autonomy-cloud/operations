import CastIntegrationAPI from "./API/CastIntegration";
import FeatureSet from "Common/Server/Types/FeatureSet";
import Express, { ExpressApplication } from "Common/Server/Utils/Express";

const CastIntegrationFeatureSet: FeatureSet = {
  init: async (): Promise<void> => {
    const app: ExpressApplication = Express.getExpressApp();
    app.use("/api/cast/v1", new CastIntegrationAPI().router);
  },
};

export default CastIntegrationFeatureSet;
