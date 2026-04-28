export type OptionType<T extends string = string> = { value: T; label: string };

export type CloneNode<Props> = React.ReactElement<Props, React.FunctionComponent>;
