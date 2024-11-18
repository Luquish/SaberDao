export const styleColor = (style) => {
    switch (style) {
        case "text":
            return "#ffffff"; // white
        case "cpi":
        case "system":
            return "#60a5fa"; // blue-400
        case "success":
            return "#10b981"; // primary-500 (emerald-500)
        case "programError":
        case "runtimeError":
            return "#ef4444"; // accent-500 (red-500)
    }
};
