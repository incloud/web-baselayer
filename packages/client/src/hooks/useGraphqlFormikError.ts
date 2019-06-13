import { FormikErrors } from 'formik';
import { ExecutionResult, GraphQLError } from 'graphql';
import { FormError } from './../components/FormError';

interface IValidationError {
  children: string[];
  constraints: {
    [k: string]: string;
  };
  property: string;
  value: string;
}

interface IFlatErrors {
  [k: string]: string;
}

interface IGraphQlFormikError<TVariables> {
  fieldErrors: FormikErrors<Partial<TVariables>>;
  formErrors: string[];
}

const flattenValidationErrors = (
  validationErrors: IValidationError[],
): IFlatErrors => {
  return validationErrors.reduce<IFlatErrors>((prev, validationError) => {
    prev[validationError.property] = Object.values(
      validationError.constraints,
    )[0];
    return prev;
  }, {});
};

export const graphqlFormikError = <TData, TVariables>(
  errors: ReadonlyArray<GraphQLError>,
  variables: TVariables,
) => {
  if (errors) {
    const returnObject = errors.reduce<IGraphQlFormikError<TVariables>>(
      (prev, error) => {
        if (error.extensions) {
          switch (error.extensions.code) {
            case 'ARGUMENT_VALIDATION_ERROR':
              const flattenedErrors = flattenValidationErrors(
                error.extensions.exception.validationErrors,
              );
              prev.fieldErrors = { ...prev.fieldErrors, ...flattenedErrors };
              return prev;
            default:
              prev.formErrors.push(error.message);
              return prev;
          }
        }
        return prev;
      },
      { fieldErrors: {}, formErrors: [] },
    );
    return returnObject;
  }
  return null;
};
