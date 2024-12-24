use anchor_lang::prelude::*;
use anchor_spl::token::{ self, Mint, Token, TokenAccount, Transfer };
use anchor_spl::associated_token::AssociatedToken;

use crate::state::{ Locker, LOCKER_SEED };
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct LockPosition<'info> {
    /// The owner of the NFT to be locked.
    #[account(mut)]
    pub user: Signer<'info>,

    /// The mint address of the NFT.
    #[account(
        mint::decimals = 0,
        constraint = nft_mint.supply == 1 @ErrorCode::MintNotNFT 
    )]
    pub nft_mint: Account<'info, Mint>,

    /// The PDA to store information about the locked position.
    #[account(
        init,
        seeds = [user.key().as_ref(), nft_mint.key().as_ref(), LOCKER_SEED],
        bump,
        payer = user,
        space = Locker::LEN
    )]
    pub locker: Account<'info, Locker>,

    /// The ATA of the locker to hold the NFT.
    #[account(
        init,
        payer = user,
        associated_token::mint = nft_mint,
        associated_token::authority = locker
    )]
    pub nft_vault: Account<'info, TokenAccount>,

    /// The ATA of the user from which the NFT will be transferred.
    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = user,
        constraint = nft_token_account.amount == 1 @ErrorCode::TokenAccountEmpty
    )]
    pub nft_token_account: Account<'info, TokenAccount>,

    /// The program used to transfer the NFT from the user to the vault.
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,

    /// The program used to create an ATA for receiving the position NFT.
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// The program used to create the locker state account.
    pub system_program: Program<'info, System>,
}

pub fn lock_position_handler(
    ctx: Context<LockPosition>,
    _duration: u32,
    _allow_fee_claim: bool
) -> Result<()> {
    require!(_duration > 0, ErrorCode::InvalidDuration);

    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), Transfer {
        from: ctx.accounts.nft_token_account.to_account_info(),
        to: ctx.accounts.nft_vault.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    });

    token::transfer(cpi_ctx, 1)?;

    let current_time: u64 = Clock::get()?.unix_timestamp.try_into().unwrap();
    let unlock_time = current_time.checked_add(u64::from(_duration)).unwrap();

    let locker = &mut ctx.accounts.locker;
    **locker = Locker::init(
        ctx.accounts.user.key(),
        ctx.accounts.nft_mint.key(),
        unlock_time,
        _allow_fee_claim
    );

    Ok(())
}
