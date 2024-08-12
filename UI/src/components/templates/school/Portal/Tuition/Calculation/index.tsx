import React, { useState } from "react";
import { Button } from "../../../../../atoms/Buttons/Regular";
import { Subtitle as Heading, Text } from "../../../../../atoms/Typography";
import { validateCalculation } from "./validation";
import { mockRequest } from "../../../../../../utils/mockRequest";
import Loading from "../../../../../molecules/Loaders/LoaderWrapper";
import {
  repaymentCalculatorFormInit,
  repaymentInformation,
  repaymentTerms,
  repaymentTermsFormInit,
} from "./config";

const Calculator = () => {
  const [form, setForm] = useState(repaymentCalculatorFormInit());
  const [loading, setLoading] = useState(false);
  const [repaymentTermsForm, setRepaymentTermsForm] = useState(
    repaymentTermsFormInit()
  );

  const onChangeHandler = (e: any) => {
    const { value, name } = e.target;
    setForm((prevState: any) => ({
      ...prevState,
      [name]: { ...prevState[name], value, message: "" },
    }));
  };

  const onSubmitCalculation = async (e: any) => {
    e.preventDefault();
    const [isValid, updatedForm] = validateCalculation(form);
    if (isValid) {
      setLoading(true);
      await mockRequest();
      setRepaymentTermsForm(repaymentTermsFormInit());
      setLoading(false);
    } else {
      setForm(updatedForm);
    }
  };

  return (
    <Loading loading={loading}>
      <form className="form-wrapper" onSubmit={onSubmitCalculation}>
        <Heading className="heading">repayment calculator</Heading>
        <Text className="subheading">
          Here are the estimated repayment values for your workout payment plan
          tuition payment program. Please evaluate closely to make sure you can
          afford the payment amount.
        </Text>

        <div className="calculation">
          {repaymentInformation(form).map(
            ({ component: Component, ...item }) => {
              return (
                <Component
                  key={item?.name}
                  {...item}
                  onChange={onChangeHandler}
                />
              );
            }
          )}
        </div>
        <div className="calculation">
          {repaymentTerms(repaymentTermsForm).map(
            ({ component: Component, ...item }) => {
              return <Component key={item?.name} {...item} disabled />;
            }
          )}
        </div>
        <div>
          <Button type="submit" className="contained">
            calculate terms
          </Button>
        </div>
      </form>
    </Loading>
  );
};

export default Calculator;
