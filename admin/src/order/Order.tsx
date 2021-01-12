import * as React from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import { Formik } from "formik";
import pick from "lodash.pick";

import {
  Form,
  EnumFormStyle,
  Button,
  FormHeader,
  Snackbar,
  EnumButtonStyle,
  TextField,
} from "@amplication/design-system";

import { api } from "../api";
import useBreadcrumbs from "../components/breadcrumbs/use-breadcrumbs";
import { CustomerSelect } from "../customer/CustomerSelect";
import { Order as TOrder } from "../api/order/Order";
import { OrderUpdateInput } from "../api/order/OrderUpdateInput";

export const Order = (): React.ReactElement => {
  const match = useRouteMatch<{ id: string }>("/orders/:id/");
  const id = match?.params?.id;
  const history = useHistory();

  const { data, isLoading, isError, error } = useQuery<
    TOrder,
    AxiosError,
    [string, string]
  >(["get-/api/orders", id], async (key: string, id: string) => {
    const response = await api.get(`${"/api/orders"}/${id}`);
    return response.data;
  });

  const [deleteEntity] = useMutation<TOrder, AxiosError>(
    async (data) => {
      const response = await api.delete(`${"/api/orders"}/${id}`, data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        history.push("//orders");
      },
    }
  );

  const [
    update,
    { error: updateError, isError: updateIsError, isLoading: updateIsLoading },
  ] = useMutation<TOrder, AxiosError, OrderUpdateInput>(async (data) => {
    const response = await api.patch(`${"/api/orders"}/${id}`, data);
    return response.data;
  });

  const handleSubmit = React.useCallback(
    (values: OrderUpdateInput) => {
      void update(values);
    },
    [update]
  );

  useBreadcrumbs(match?.url, data?.price);

  const handleDelete = React.useCallback(() => {
    void deleteEntity();
  }, [deleteEntity]);

  const errorMessage =
    updateError?.response?.data?.message || error?.response?.data?.message;

  const initialValues = React.useMemo(() => pick(data, ["customer", "price"]), [
    data,
  ]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <>
      {data && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form
            formStyle={EnumFormStyle.Horizontal}
            formHeaderContent={
              <FormHeader
                title={`${"Order"} ${
                  data?.price && data?.price.length ? data.price : data?.id
                }`}
              >
                <Button
                  type="button"
                  disabled={updateIsLoading}
                  buttonStyle={EnumButtonStyle.Secondary}
                  icon="trash_2"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button type="submit" disabled={updateIsLoading}>
                  Save
                </Button>
              </FormHeader>
            }
          >
            <div>
              <CustomerSelect label="Customer" name="customer.id" />
            </div>
            <div>
              <TextField label="Price" name="price" />
            </div>
          </Form>
        </Formik>
      )}
      <Snackbar open={isError || updateIsError} message={errorMessage} />
    </>
  );
};
