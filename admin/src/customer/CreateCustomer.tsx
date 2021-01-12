import * as React from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { Formik } from "formik";
import {
  Form,
  EnumFormStyle,
  Button,
  FormHeader,
  Snackbar,
  TextField,
} from "@amplication/design-system";
import { api } from "../api";
import useBreadcrumbs from "../components/breadcrumbs/use-breadcrumbs";
import { Customer } from "../api/customer/Customer";
import { CustomerCreateInput } from "../api/customer/CustomerCreateInput";

const INITIAL_VALUES = {} as CustomerCreateInput;

export const CreateCustomer = (): React.ReactElement => {
  useBreadcrumbs("/customers/new", "Create Customer");
  const history = useHistory();

  const [create, { error, isError, isLoading }] = useMutation<
    Customer,
    AxiosError,
    CustomerCreateInput
  >(
    async (data) => {
      const response = await api.post("/api/customers", data);
      return response.data;
    },
    {
      onSuccess: (data, variables) => {
        history.push(`${"/customers"}/${data.id}`);
      },
    }
  );
  const handleSubmit = React.useCallback(
    (values: CustomerCreateInput) => {
      void create(values);
    },
    [create]
  );
  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form
          formStyle={EnumFormStyle.Horizontal}
          formHeaderContent={
            <FormHeader title={"Create Customer"}>
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
            </FormHeader>
          }
        >
          <div>
            <TextField label="Address" name="address" />
          </div>
          <div>
            <TextField label="Name" name="name" />
          </div>
        </Form>
      </Formik>
      <Snackbar open={isError} message={error?.response?.data?.message} />
    </>
  );
};
