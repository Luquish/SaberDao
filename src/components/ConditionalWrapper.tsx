export default function ConditionalWrapper({ condition, wrapper, children }: any) {
    return condition ? wrapper(children) : children;
}
