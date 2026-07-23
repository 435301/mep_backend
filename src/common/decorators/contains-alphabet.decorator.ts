import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function ContainsAlphabet(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsAlphabet',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }

          // Must contain at least one alphabet
          return /[A-Za-z]/.test(value);
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain at least one alphabet.`;
        },
      },
    });
  };
}