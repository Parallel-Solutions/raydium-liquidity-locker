# Raydium Liquidity Locker Program

This is a liquidity locker program that allows protocols to lock their Raydium Concentrated Pool liquidity for a defined time frame by submitting the position NFTs into the program. It also enables liquidity owners to claim fees accumulated on their liquidity during the locked period.

## Requirements

- Anchor 0.29.0
- Solana 1.18.1
- Rust 1.75.0

## Setup

Install Anchor using instructions found [here](https://book.anchor-lang.com/getting_started/installation.html#anchor).

Set up a valid Solana keypair at the path specified in the `wallet` in `Anchor.toml` and replace the pubkey of DEPLOYER with that account key in `state.rs`.

To do local testing with `anchor test` flows.
