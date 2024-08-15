export default interface ValidatorInterface<T> {
    validate(value: T): void;
}