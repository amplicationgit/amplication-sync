import { CustomerWhereUniqueInput } from "../customer/CustomerWhereUniqueInput";

export type Order = {
  createdAt: Date;
  customer: CustomerWhereUniqueInput | null;
  id: string;
  price: string | null;
  updatedAt: Date;
};
