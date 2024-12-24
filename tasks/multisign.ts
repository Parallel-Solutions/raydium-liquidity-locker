import * as multisig from '@sqds/multisig';
import { Keypair, TransactionInstruction, TransactionMessage } from '@solana/web3.js';

import { MULTISIGN_KEY, CONNECTION } from './constants';

export async function sendTx(payer: Keypair, instructions: TransactionInstruction[]) {
  const transactionIndex = BigInt(15);

  const txMessage = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: (await CONNECTION.getLatestBlockhash()).blockhash,
    instructions: instructions,
  });

  const tx = await multisig.rpc.vaultTransactionCreate({
    connection: CONNECTION,
    feePayer: payer,
    multisigPda: MULTISIGN_KEY,
    transactionIndex: transactionIndex,
    creator: payer.publicKey,
    vaultIndex: 0,
    ephemeralSigners: 0,
    transactionMessage: txMessage,
  });

  return tx;
}
