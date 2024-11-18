import { findGaugeAddress, GaugeSDK } from "@quarryprotocol/gauge";
import { useSail, useToken } from "@rockooor/sail";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useProvider } from "@/hooks/useProvider";
import { useWrapTx } from "@/hooks/useWrapTx";
import { useGaugeData } from "@/utils/tribeca/parsers";
import { AddressLink } from "@/common/AddressLink";
import { AsyncButton } from "@/common/AsyncButton";
import { Button } from "@/common/Button";
import { ContentLoader } from "@/common/ContentLoader";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { Toggle } from "@/common/Toggle";
import { TokenIcon } from "@/common/TokenIcon";
export const GaugeInfo = ({ quarry }) => {
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const { ownerInvokeTX, ownerInvokerKey } = useExecutiveCouncil();
    const { providerMut, newTX } = useProvider();
    const { gauge: gaugeSettings } = useGovernor();
    const { data: gaugeKey } = useQuery({
        queryKey: [
            "gaugeKey",
            gaugeSettings?.gaugemeister.toString(),
            quarry.key.toString(),
        ],
        queryFn: async () => {
            invariant(gaugeSettings);
            const [key] = await findGaugeAddress(gaugeSettings.gaugemeister, quarry.key);
            return key;
        },
        enabled: !!gaugeSettings,
    });
    const { data: gauge } = useGaugeData(gaugeKey);
    const { data: stakedToken } = useToken(quarry.quarry.account.tokenMintKey);
    return (React.createElement("tr", null,
        React.createElement("td", null,
            React.createElement("div", { tw: "flex gap-2 items-center" },
                React.createElement(TokenIcon, { token: stakedToken }),
                stakedToken?.name ?? React.createElement(ContentLoader, { tw: "h-3 w-10" }))),
        React.createElement("td", null,
            React.createElement(AddressLink, { address: quarry.quarry.account.tokenMintKey, showCopy: true })),
        React.createElement("td", null, gauge ? (React.createElement(Toggle, { label: gauge.account.isDisabled ? "Enable Gauge" : "Disable Gauge", checked: !gauge.account.isDisabled, onChange: async () => {
                invariant(gaugeKey && gaugeSettings && providerMut && ownerInvokerKey);
                const gaugeSDK = GaugeSDK.load({ provider: providerMut });
                if (gauge.account.isDisabled) {
                    const enableGaugeTX = await gaugeSDK.gauge.enableGauge({
                        gauge: gaugeKey,
                    });
                    await ownerInvokeTX(enableGaugeTX, "Enable Gauge");
                }
                else {
                    const disableGaugeTX = newTX([
                        gaugeSDK.gauge.program.instruction.gaugeDisable({
                            accounts: {
                                gaugemeister: gaugeSettings.gaugemeister,
                                gauge: gaugeKey,
                                foreman: ownerInvokerKey,
                            },
                        }),
                    ]);
                    await ownerInvokeTX(disableGaugeTX, "Disable Gauge");
                }
            } })) : (React.createElement("span", { tw: "text-gray-400" }, "Not found"))),
        React.createElement("td", null,
            React.createElement("div", { tw: "flex gap-4" }, gauge ? (React.createElement(Button, { disabled: true }, gauge === undefined ? React.createElement(LoadingSpinner, null) : "Already Created")) : (React.createElement(AsyncButton, { disabled: !gaugeSettings, onClick: async (sdkMut) => {
                    invariant(gaugeSettings);
                    const gaugeSDK = GaugeSDK.load({ provider: sdkMut.provider });
                    const { tx: createGaugeTX } = await gaugeSDK.gauge.createGauge({
                        gaugemeister: gaugeSettings.gaugemeister,
                        quarry: quarry.key,
                    });
                    await handleTX(await wrapTx(createGaugeTX), "Create Gauge");
                } }, "Add Gauge"))))));
};
