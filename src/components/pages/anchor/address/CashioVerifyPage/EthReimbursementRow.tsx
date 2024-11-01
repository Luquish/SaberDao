import type { EthereumHackerReimbursement } from "./useCashioHackUBOInfo";

interface Props {
  reimbursement: EthereumHackerReimbursement;
}

export const EthReimbursementRow: React.FC<Props> = ({
  reimbursement,
}: Props) => {
  return (
    <tr>
      <td>
        <a
          href={`https://etherscan.io/address/${reimbursement.to}`}
          target="_blank"
          rel="noreferrer"
        >
          {reimbursement.to}
        </a>
      </td>
      <td>{parseFloat(reimbursement.value).toLocaleString()} ETH</td>
      <td>
        <a
          href={`https://etherscan.io/address/${reimbursement.to}`}
          target="_blank"
          rel="noreferrer"
        >
          {reimbursement.to}
        </a>{" "}
        (Ethereum)
      </td>
      <td>
        <a
          href={`https://etherscan.io/tx/${reimbursement.tx}`}
          target="_blank"
          rel="noreferrer"
        >
          {reimbursement.tx}
        </a>
      </td>
    </tr>
  );
};
