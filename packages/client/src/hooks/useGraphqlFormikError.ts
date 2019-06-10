import { ExecutionResult, GraphQLError } from 'graphql';
import { FormikErrors } from 'formik';

interface ValidationError {
  children: string[];
  constraints: {
    [k: string]: string;
  };
  property: string;
  value: string;
}

interface FlatErrors {
  [k: string]: string;
}

interface GraphQlFormikError<TVariables> {
  fieldErrors: FormikErrors<TVariables>;
  formErrors: string[];
}

const flattenValidationErrors = (
  validationErrors: ValidationError[],
): FlatErrors => {
  return validationErrors.reduce<FlatErrors>((prev, validationError) => {
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
    const flattenedErrors = errors.reduce<GraphQlFormikError<TVariables>>(
      (prev, error) => {
        debugger;
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
    return flattenedErrors;
  }
  return null;
};
