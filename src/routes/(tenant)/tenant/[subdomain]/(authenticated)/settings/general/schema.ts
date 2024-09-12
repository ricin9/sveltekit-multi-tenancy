import { tenantCreationSchema } from "../../../../../../(central)/schema";

export const tenantNameSchema = tenantCreationSchema.pick({ tenantName: true });
