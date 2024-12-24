use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Claim not allowed")]
    ClaimNotAllowed,
    #[msg("Invali duration")]
    InvalidDuration,
    #[msg("Mint is not a nft")]
    MintNotNFT,
    #[msg("Lp not unlocked")]
    NotUnlocked,
    #[msg("Token account is empty")]
    TokenAccountEmpty,
}