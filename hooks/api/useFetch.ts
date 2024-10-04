import { useMemo } from 'react';
import useSwr from 'swr';
import type { Mixed, TypeOf } from 'io-ts';
import { either, pipeable } from 'fp-ts';

/**
 * Takes unknown data and returns a strongly typed data.
 * If data does not match expected API interface, it throws a TypeError.
 *
 * @throws TypeError
 */
export const validateDataShape = <T extends Mixed>(data: unknown, validateShape: T): TypeOf<T> =>
  pipeable.pipe(
    validateShape.decode(data),
    either.fold(
      /**
       * Where there is an error, throw exception and log a message.
       * Example message: 'value 3 is unexpected type, at root > themes > 2 > onGradeLevel,
       * actual type "string" expected type "number"'
       */
      (errors) => {
        throw new TypeError(
          errors
            .map(({ message, context, value }) => {
              const overallErrorDescription = message || `value ${value} is unexpected type, at`;
              return `${overallErrorDescription} ${context
                .map(({ key }) => key || 'root')
                .join(' > ')}, actual type "${typeof context[context.length - 1]
                .actual}" expected type "${context[context.length - 1].type.name}"`;
            })
            .join('; ')
        );
      },
      /**
       * Pass valid value through
       */
      (value) => value
    )
  );

/**
 * Ensures that the returned data is a JSON object and validates
 * it against the passed shape
 *
 * @throws TypeError
 */
const validateData = <T extends Mixed>(data: unknown, shape: T) => {
  if (typeof data === 'string') {
    throw new TypeError('"content-type" header is not set to "application/json"');
  }

  return validateDataShape(data, shape);
};

export interface UseFetchProps<T extends Mixed> {
  /**
   * Web address to fetch
   */
  url: string;

  /**
   * io-ts shape to validate the returned data against
   */
  shape: T;
}

/**
 * Make a generic request
 */
export const useFetch = <T extends Mixed>({ url, shape }: UseFetchProps<T>) => {
  const fetcher = async (uri: string) => {
    const response = await fetch(uri);

    return response.json();
  };

  const { data, isLoading, error } = useSwr(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    suspense: false
  });

  if (error) {
    throw error;
  }

  if (!isLoading){
    return useMemo(() => validateData(data, shape), [data, shape]);
  } else {
    return useMemo(() => null);
  }
};

export default useFetch;